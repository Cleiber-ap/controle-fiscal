"""
Conferencia de consistencia do Controle Fiscal. NAO grava nada, so relata.

MODO BANCO (sempre roda)
    Recalcula o faturamento de cada mes a partir das notas gravadas e compara
    com historico_faturamento; audita a tabela de ajustes de devolucao.

MODO XML (opcional, passe pastas como argumento)
    Le os XMLs do disco e compara com o banco: nota faltando, valor divergente,
    devolucao sem ajuste, ajuste no mes errado.

Uso:
    cd C:\\Projetos\\controle-fiscal\\backend
    railway run venv\\Scripts\\python.exe reconciliar.py
    railway run venv\\Scripts\\python.exe reconciliar.py "C:\\Users\\cleib\\Downloads\\SIX_agosto_2026_xmls"

Saida: 0 se nada foi apontado, 1 se houve achado.
"""
import json
import os
import re
import sys
from collections import defaultdict

sys.path.insert(0, '.')

from app.database import SessionLocal
from app.models.empresa import HistoricoFaturamento
from app.routers.notas import AjusteDevolucao, NotaFiscal
from app.routers.funcionarios import FechamentoEncargos, Funcionario, HorasExtras

# Mesmo criterio do ImportarXML: CNPJ do emitente decide a empresa.
CNPJ_EMPRESA = {
    '09648409000193': 1,   # SIX
    '38345220000120': 2,   # ENOVA
}
NOME_EMPRESA = {1: 'SIX', 2: 'ENOVA', 3: 'CM'}

achados = []


def apontar(secao, linhas):
    """Registra um achado. `linhas` vazio significa 'nada a apontar'."""
    if linhas:
        achados.append((secao, linhas))


def titulo(txt):
    print()
    print('=' * 78)
    print(txt)
    print('=' * 78)


def mes_ano(dt):
    """DD/MM/AAAA -> (ano, mes) ou None."""
    if not dt or '/' not in dt:
        return None
    p = dt.split('/')
    if len(p) != 3:
        return None
    try:
        return int(p[2]), int(p[1])
    except ValueError:
        return None


def eh_faturamento(nota, canceladas):
    """Replica exatamente o filtro do recalculo do ImportarXML."""
    if nota.numero_nf in canceladas:
        return False
    if (nota.tipo or 'saida') == 'entrada':
        return False
    st = (nota.nat_operacao or nota.status or '').lower()
    return (('venda' in st and 'devolu' not in st)
            or 'complemento de frete' in st
            or 'complementar' in st)


def conferir_fechamentos(db):
    """
    Mes fechado nao deve mudar. Compara os dados guardados no fechamento com o
    cadastro de hoje: se um salario foi reajustado, um lancamento alterado ou um
    funcionario entrou/saiu, o total congelado deixou de corresponder a realidade
    que o produziu.

    Compara DADOS, nao recalcula: a regra de calculo vive em
    frontend/src/utils/encargos.ts e reimplementa-la aqui criaria duas versoes da
    mesma formula — o defeito que originou este script.
    """
    titulo('MODO BANCO — fechamentos da folha')

    fechamentos = db.query(FechamentoEncargos).order_by(
        FechamentoEncargos.ano, FechamentoEncargos.mes).all()
    print('  %d mes(es) fechado(s)' % len(fechamentos))
    if not fechamentos:
        return

    CAMPOS = [
        ('salario_base', 'salario'),
        ('vale_alimentacao', 'vale alimentacao'),
        ('salario_dinheiro', 'salario em dinheiro'),
        ('vale_transporte_valor', 'valor do VT'),
    ]
    alterados, sem_detalhe = [], []

    for f in fechamentos:
        ref = '%02d/%d' % (f.mes, f.ano)
        if not f.detalhe:
            sem_detalhe.append('  %s — fechado antes do detalhe passar a ser gravado' % ref)
            continue
        try:
            det = json.loads(f.detalhe)
        except ValueError:
            sem_detalhe.append('  %s — detalhe ilegivel' % ref)
            continue

        atuais = {x.id: x for x in db.query(Funcionario).all()}
        lanc = {x.funcionario_id: x for x in db.query(HorasExtras).filter(
            HorasExtras.ano == f.ano, HorasExtras.mes == f.mes).all()}

        for snap in det.get('funcionarios', []):
            fid = snap.get('funcionario_id')
            nome = snap.get('nome') or ('id %s' % fid)
            atual = atuais.get(fid)
            if not atual:
                alterados.append('  %s · %s — funcionario nao existe mais no cadastro' % (ref, nome))
                continue
            for campo, rotulo in CAMPOS:
                antes = float(snap.get(campo) or 0)
                agora = float(getattr(atual, campo, 0) or 0)
                if abs(antes - agora) >= 0.01:
                    alterados.append('  %s · %s — %s: fechado com R$ %.2f, hoje R$ %.2f'
                                     % (ref, nome, rotulo, antes, agora))
            l = lanc.get(fid)
            for campo, rotulo, padrao in [('horas', 'horas extras', 0),
                                          ('mult_he', 'multiplicador de HE', 1.5),
                                          ('faltas', 'faltas', 0)]:
                antes = float(snap.get(campo) if snap.get(campo) is not None else padrao)
                agora = float(getattr(l, campo, None) if l and getattr(l, campo, None) is not None else padrao)
                if abs(antes - agora) >= 0.01:
                    alterados.append('  %s · %s — %s: fechado com %.2f, hoje %.2f'
                                     % (ref, nome, rotulo, antes, agora))

        # Funcionario ausente do snapshot so e problema se ja existia quando o mes
        # foi fechado. Quem foi cadastrado depois nao tinha como estar la, e
        # apontar isso a cada contratacao tornaria o relatorio ruidoso.
        ids_snap = {x.get('funcionario_id') for x in det.get('funcionarios', [])}
        for fid, at in atuais.items():
            if fid in ids_snap or not getattr(at, 'ativo', True):
                continue
            criado = getattr(at, 'created_at', None)
            if criado and f.fechado_em and criado > f.fechado_em:
                continue  # contratado depois: esperado
            alterados.append('  %s · %s — ja existia no cadastro mas ficou fora do fechamento'
                             % (ref, at.nome))

        print('    %s · %d funcionario(s) · custo total R$ %.2f%s'
              % (ref, len(det.get('funcionarios', [])), f.total_empresa or 0,
                 ' · INSS ' + det['inss_vigencia'] if det.get('inss_vigencia') else ''))

    apontar('Mes fechado cujos dados mudaram depois', alterados)
    if sem_detalhe:
        print()
        print('  Informativo — fechamento sem detalhe para comparar (%d):' % len(sem_detalhe))
        for l in sem_detalhe:
            print(l)


# ─────────────────────────────────────────────────────────────── leitura XML ──

def ler_xml(caminho):
    try:
        with open(caminho, 'rb') as fh:
            txt = fh.read().decode('utf-8', errors='replace')
    except OSError:
        return None

    def tag(nome):
        m = re.search(r'<%s>([^<]*)</%s>' % (nome, nome), txt)
        return m.group(1).strip() if m else ''

    nome_arq = os.path.basename(caminho).lower()
    eh_cce = '<procEventoNFe' in txt and 'carta de correc' in txt.lower()
    eh_can = (not eh_cce) and ('<procEventoNFe' in txt or 'nfe-can' in nome_arq)

    nnf = tag('nNF')
    if not nnf:
        return None

    emit = re.search(r'<emit>.*?<CNPJ>(\d+)</CNPJ>', txt, re.S)
    dh = tag('dhEmi') or tag('dEmi')
    data = ''
    m = re.match(r'^(\d{4})-(\d{2})-(\d{2})', dh)
    if m:
        data = '%s/%s/%s' % (m.group(3), m.group(2), m.group(1))

    tp = re.search(r'<tpNF>(\d)</tpNF>', txt)
    try:
        valor = float(tag('vNF') or 0)
    except ValueError:
        valor = 0.0

    return {
        'arquivo': os.path.basename(caminho),
        'numero_nf': nnf + ('-CCE' if eh_cce else '-CAN' if eh_can else ''),
        'numero_base': nnf,
        'evento': 'CCE' if eh_cce else 'CAN' if eh_can else None,
        'cnpj_emit': emit.group(1) if emit else '',
        'valor': valor,
        'data': data,
        'nat_op': tag('natOp'),
        'tipo': 'entrada' if (tp and tp.group(1) == '0') else 'saida',
        'refNFe': tag('refNFe'),
        'finNFe': tag('finNFe'),
        'cfops': sorted(set(re.findall(r'<CFOP>(\d+)</CFOP>', txt))),
    }


def varrer(pastas):
    notas = []
    for pasta in pastas:
        if not os.path.isdir(pasta):
            print('  !! pasta inexistente: %s' % pasta)
            continue
        for raiz, _, arquivos in os.walk(pasta):
            for a in arquivos:
                if a.lower().endswith('.xml'):
                    nf = ler_xml(os.path.join(raiz, a))
                    if nf:
                        notas.append(nf)
    return notas


# ────────────────────────────────────────────────────────────── modo banco ──

def conferir_banco(db):
    titulo('MODO BANCO — historico de faturamento')

    for emp in sorted(NOME_EMPRESA):
        notas = db.query(NotaFiscal).filter(NotaFiscal.empresa_id == emp).all()
        hist = db.query(HistoricoFaturamento).filter(
            HistoricoFaturamento.empresa_id == emp).all()
        if not notas and not hist:
            continue

        canceladas = {n.numero_nf.replace('-CAN', '') for n in notas
                      if n.numero_nf and n.numero_nf.endswith('-CAN')}

        soma = defaultdict(float)
        sem_data = []
        for n in notas:
            if not eh_faturamento(n, canceladas):
                continue
            ma = mes_ano(n.dt_emissao)
            if not ma:
                sem_data.append(n)
                continue
            soma[ma] += float(n.valor_nf or 0)

        hist_map = {(h.ano, h.mes): float(h.valor or 0) for h in hist}

        divergentes, so_no_banco = [], []
        for ma, total in sorted(soma.items()):
            gravado = hist_map.get(ma)
            if gravado is None:
                so_no_banco.append('  %s %02d/%d · notas somam R$ %.2f · SEM linha no historico'
                                   % (NOME_EMPRESA[emp], ma[1], ma[0], total))
            elif abs(gravado - total) >= 0.01:
                divergentes.append(
                    '  %s %02d/%d · historico R$ %.2f · notas R$ %.2f · dif R$ %.2f'
                    % (NOME_EMPRESA[emp], ma[1], ma[0], gravado, total, total - gravado))

        semeados = len([k for k in hist_map if k not in soma])
        print('  %-6s %3d meses no historico · %2d com notas · %2d sem nota (intocaveis pelo recalculo)'
              % (NOME_EMPRESA[emp], len(hist_map), len(soma), semeados))

        apontar('Historico divergente da soma das notas', divergentes)
        apontar('Mes com notas mas sem linha no historico', so_no_banco)
        apontar('Nota sem data de emissao legivel',
                ['  %s NF %s · dt_emissao=%r' % (NOME_EMPRESA[emp], n.numero_nf, n.dt_emissao)
                 for n in sem_data])

        # Entrada que passaria no filtro de faturamento (deve ser zero)
        intrusas = [n for n in notas if (n.tipo or 'saida') == 'entrada'
                    and n.numero_nf not in canceladas
                    and 'venda' in (n.nat_operacao or n.status or '').lower()
                    and 'devolu' not in (n.nat_operacao or n.status or '').lower()]
        apontar('Nota de ENTRADA que seria somada como faturamento',
                ['  %s NF %s · %s · R$ %.2f · %s'
                 % (NOME_EMPRESA[emp], n.numero_nf, n.dt_emissao, n.valor_nf or 0, n.nat_operacao)
                 for n in intrusas])

        # -CAN orfao
        nums = {n.numero_nf for n in notas}
        apontar('Cancelamento (-CAN) de NF que nao existe',
                ['  %s %s' % (NOME_EMPRESA[emp], c) for c in sorted(canceladas) if c not in nums])


def conferir_ajustes(db):
    titulo('MODO BANCO — ajustes de devolucao')

    ajustes = db.query(AjusteDevolucao).all()
    print('  %d ajuste(s) no banco' % len(ajustes))

    # Meses cujas VENDAS estao no banco. Antes de 2026 o faturamento veio do
    # seed e os XMLs nunca foram importados, entao a venda referenciada por uma
    # devolucao antiga simplesmente nao existe como registro — isso e esperado,
    # nao defeito, e apontar sempre so treinaria o leitor a ignorar o relatorio.
    meses_com_venda = set()
    for n in db.query(NotaFiscal).filter(NotaFiscal.tipo != 'entrada').all():
        ma = mes_ano(n.dt_emissao)
        if ma:
            meses_com_venda.add((n.empresa_id, ma[0], ma[1]))

    por_dev = defaultdict(list)
    por_chave = defaultdict(list)
    for aj in ajustes:
        por_dev[(aj.empresa_id, aj.nf_devolucao)].append(aj)
        if aj.chave_ref:
            por_chave[aj.chave_ref].append(aj)

    apontar('Ajuste duplicado (mesma NF de devolucao)',
            ['  emp%d NF %s · %d registros: ids %s'
             % (k[0], k[1], len(v), [a.id for a in v])
             for k, v in sorted(por_dev.items()) if len(v) > 1])
    apontar('Ajuste duplicado (mesma chave de referencia)',
            ['  chave %s · ids %s' % (k, [a.id for a in v])
             for k, v in sorted(por_chave.items()) if len(v) > 1])

    mes_errado, orfaos, sem_venda, valor_dif, fora_do_periodo = [], [], [], [], []
    for aj in ajustes:
        nota = db.query(NotaFiscal).filter(
            NotaFiscal.numero_nf == aj.nf_devolucao,
            NotaFiscal.empresa_id == aj.empresa_id).first()
        if not nota:
            orfaos.append('  id %d · emp%d · NF devolucao %s nao existe em notas_fiscais'
                          % (aj.id, aj.empresa_id, aj.nf_devolucao))
        else:
            ma = mes_ano(nota.dt_emissao)
            if ma and (aj.ano, aj.mes) != ma:
                mes_errado.append('  id %d · emp%d · NF %s emitida %s · ajuste em %02d/%d (deveria ser %02d/%d)'
                                  % (aj.id, aj.empresa_id, aj.nf_devolucao, nota.dt_emissao,
                                     aj.mes, aj.ano, ma[1], ma[0]))
            if abs(float(nota.valor_nf or 0) - float(aj.valor or 0)) >= 0.01:
                valor_dif.append('  id %d · emp%d · NF %s vale R$ %.2f · ajuste R$ %.2f'
                                 % (aj.id, aj.empresa_id, aj.nf_devolucao,
                                    nota.valor_nf or 0, aj.valor or 0))

        if aj.nf_referenciada:
            venda = db.query(NotaFiscal).filter(
                NotaFiscal.numero_nf == aj.nf_referenciada,
                NotaFiscal.empresa_id == aj.empresa_id).first()
            if not venda:
                # So aponta se o mes daquele ajuste tem vendas no banco; se nao
                # tem, o periodo e anterior a importacao de XML e a ausencia e
                # esperada.
                if (aj.empresa_id, aj.ano, aj.mes) in meses_com_venda:
                    sem_venda.append('  id %d · emp%d · venda referenciada NF %s nao existe'
                                     % (aj.id, aj.empresa_id, aj.nf_referenciada))
                else:
                    fora_do_periodo.append(
                        '  id %d · emp%d · NF %s · %02d/%d — periodo sem XML importado'
                        % (aj.id, aj.empresa_id, aj.nf_referenciada, aj.mes, aj.ano))
            elif abs(float(venda.valor_nf or 0) - float(aj.valor or 0)) >= 0.01:
                valor_dif.append('  id %d · emp%d · venda NF %s vale R$ %.2f · ajuste R$ %.2f'
                                 % (aj.id, aj.empresa_id, aj.nf_referenciada,
                                    venda.valor_nf or 0, aj.valor or 0))

    apontar('Ajuste no mes errado (deve ser o mes da nota de entrada)', mes_errado)
    apontar('Ajuste orfao (nota de devolucao ausente)', orfaos)
    apontar('Ajuste apontando para venda inexistente', sem_venda)
    if fora_do_periodo:
        print()
        print('  Informativo — venda referenciada fora do periodo com XML (%d):' % len(fora_do_periodo))
        for l in fora_do_periodo:
            print(l)
    apontar('Valor do ajuste diferente da nota', valor_dif)

    # Devolucao sem ajuste: o caso que passou despercebido antes
    faltando = []
    for emp in sorted(NOME_EMPRESA):
        devs = db.query(NotaFiscal).filter(
            NotaFiscal.empresa_id == emp,
            NotaFiscal.tipo == 'entrada').all()
        for d in devs:
            if not por_dev.get((emp, d.numero_nf)):
                faltando.append('  %s NF %s · %s · R$ %.2f · %s · SEM ajuste: nao reduz o RBT12'
                                % (NOME_EMPRESA[emp], d.numero_nf, d.dt_emissao,
                                   d.valor_nf or 0, d.nat_operacao))
    apontar('Nota de ENTRADA sem ajuste correspondente', faltando)


# ──────────────────────────────────────────────────────────────── modo XML ──

def conferir_xml(db, pastas):
    titulo('MODO XML — arquivos do disco x banco')
    xmls = varrer(pastas)
    print('  %d XML(s) lido(s)' % len(xmls))
    if not xmls:
        return

    desconhecidos, ausentes, divergentes, dev_sem_ajuste, mes_errado = [], [], [], [], []

    for x in xmls:
        emp = CNPJ_EMPRESA.get(x['cnpj_emit'])
        if not emp:
            desconhecidos.append('  %s · CNPJ emitente %s nao mapeado'
                                 % (x['arquivo'], x['cnpj_emit'] or '?'))
            continue

        nota = db.query(NotaFiscal).filter(
            NotaFiscal.numero_nf == x['numero_nf'],
            NotaFiscal.empresa_id == emp).first()
        if not nota:
            ausentes.append('  %s NF %s · %s · R$ %.2f · %s'
                            % (NOME_EMPRESA[emp], x['numero_nf'], x['data'],
                               x['valor'], x['arquivo']))
            continue

        if x['evento'] is None:
            if abs(float(nota.valor_nf or 0) - x['valor']) >= 0.01:
                divergentes.append('  %s NF %s · valor XML R$ %.2f · banco R$ %.2f'
                                   % (NOME_EMPRESA[emp], x['numero_nf'], x['valor'], nota.valor_nf or 0))
            if nota.dt_emissao != x['data']:
                divergentes.append('  %s NF %s · data XML %s · banco %s'
                                   % (NOME_EMPRESA[emp], x['numero_nf'], x['data'], nota.dt_emissao))
            if (nota.tipo or 'saida') != x['tipo']:
                divergentes.append('  %s NF %s · tipo XML %s · banco %s'
                                   % (NOME_EMPRESA[emp], x['numero_nf'], x['tipo'], nota.tipo))

        # Entrada com refNFe precisa de ajuste, no mes de emissao da entrada
        if x['tipo'] == 'entrada' and len(x['refNFe']) >= 34:
            aj = db.query(AjusteDevolucao).filter(
                AjusteDevolucao.empresa_id == emp,
                AjusteDevolucao.chave_ref == x['refNFe']).first()
            ma = mes_ano(x['data'])
            if not aj:
                dev_sem_ajuste.append('  %s NF %s · %s · R$ %.2f · SEM ajuste no banco'
                                      % (NOME_EMPRESA[emp], x['numero_nf'], x['data'], x['valor']))
            elif ma and (aj.ano, aj.mes) != ma:
                mes_errado.append('  %s NF %s emitida %s · ajuste em %02d/%d'
                                  % (NOME_EMPRESA[emp], x['numero_nf'], x['data'], aj.mes, aj.ano))

    conferir_classificacao(xmls)

    apontar('XML com CNPJ emitente nao reconhecido', desconhecidos)
    apontar('XML no disco que nao esta no banco', ausentes)
    apontar('Divergencia entre XML e banco', divergentes)
    apontar('Devolucao no XML sem ajuste no banco', dev_sem_ajuste)
    apontar('Ajuste em mes diferente da emissao do XML', mes_errado)


def classifica_por_texto(x):
    """Replica a regra de producao, que le a frase da natureza."""
    if x['tipo'] == 'entrada':
        return 'nao-faturamento'
    st = (x['nat_op'] or '').lower()
    if ('venda' in st and 'devolu' not in st) or 'complemento de frete' in st or 'complementar' in st:
        return 'faturamento'
    return 'nao-faturamento'


def classifica_por_estrutura(x):
    """
    Usa apenas campos estruturados da NF-e:
      finNFe  1 normal · 2 complementar · 3 ajuste · 4 devolucao
      tpNF    0 entrada · 1 saida
      CFOP    2o digito: 1 = venda · 2 = devolucao · 9 = remessa/outras
    """
    if x['finNFe'] == '4':
        return 'nao-faturamento'   # devolucao
    if x['tipo'] == 'entrada':
        return 'nao-faturamento'
    if x['finNFe'] == '2':
        return 'faturamento'       # complementar acompanha a operacao original
    grupos = {c[1] for c in x['cfops'] if len(c) >= 2}
    if '1' in grupos:
        return 'faturamento'       # venda
    return 'nao-faturamento'       # remessa, bonificacao, demonstracao...


def conferir_classificacao(xmls):
    """
    Compara a regra que le texto com a que le campos estruturados. Divergir
    significa que a frase da natureza esta decidindo algo que os codigos da NF-e
    contradizem — exatamente o risco de classificar por texto livre.
    """
    titulo('MODO XML — classificacao por texto x campos estruturados')
    divergentes, sem_cfop = [], []
    normais = [x for x in xmls if x['evento'] is None]
    for x in normais:
        if not x['cfops']:
            sem_cfop.append('  NF %s · %s' % (x['numero_nf'], x['arquivo']))
            continue
        t, e = classifica_por_texto(x), classifica_por_estrutura(x)
        if t != e:
            divergentes.append(
                '  NF %-8s "%s" · tpNF=%s finNFe=%s CFOP=%s · texto diz %s, estrutura diz %s'
                % (x['numero_nf'], (x['nat_op'] or '')[:34], '0' if x['tipo'] == 'entrada' else '1',
                   x['finNFe'] or '?', ','.join(x['cfops']), t, e))
    print('  %d nota(s) avaliada(s) · %d divergencia(s)' % (len(normais), len(divergentes)))
    apontar('Texto e campos estruturados discordam sobre ser faturamento', divergentes)
    apontar('XML sem CFOP legivel', sem_cfop)


# ───────────────────────────────────────────────────────────────────── main ──

db = SessionLocal()
try:
    conferir_banco(db)
    conferir_ajustes(db)
    conferir_fechamentos(db)
    if len(sys.argv) > 1:
        conferir_xml(db, sys.argv[1:])
    else:
        titulo('MODO XML — pulado')
        print('  Passe uma ou mais pastas como argumento para conferir XML x banco.')

    titulo('RESULTADO')
    if not achados:
        print('  Nenhuma inconsistencia encontrada.')
        print()
        sys.exit(0)

    total = sum(len(l) for _, l in achados)
    print('  %d achado(s) em %d categoria(s):' % (total, len(achados)))
    for secao, linhas in achados:
        print()
        print('  >> %s (%d)' % (secao, len(linhas)))
        for l in linhas[:20]:
            print(l)
        if len(linhas) > 20:
            print('     ... e mais %d' % (len(linhas) - 20))
    print()
    sys.exit(1)
finally:
    db.close()
