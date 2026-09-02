"""
Conserta os ajustes de devolucao ja gravados, em dois pontos:

1. MES  — realoca cada ajuste para o mes da PROPRIA nota de devolucao. Ate a
   correcao de setembro/2026 o mes vinha da chave da NF de venda referenciada,
   entao a devolucao reduzia a receita bruta do mes da venda, nao do mes em que
   ela ocorreu.

O valor gravado nao e alterado: nao existe devolucao parcial, a nota de entrada
sempre espelha a venda referenciada. O script apenas denuncia divergencias, que
indicam refNFe apontando para a NF errada.

Execute na pasta do backend:
    cd C:\\Projetos\\controle-fiscal\\backend
    venv\\Scripts\\activate
    python corrigir_mes_ajustes.py           # simulacao, nao grava nada
    python corrigir_mes_ajustes.py --apply   # grava

Para rodar contra o banco de producao, exporte a DATABASE_URL do Railway antes
(ou use `railway run python corrigir_mes_ajustes.py`).
"""
import sys

sys.path.insert(0, '.')

from app.database import SessionLocal
from app.routers.notas import AjusteDevolucao, NotaFiscal

APLICAR = '--apply' in sys.argv


def mes_ano_da_emissao(dt_emissao):
    """dt_emissao vem como DD/MM/AAAA. Retorna (ano, mes) ou None."""
    if not dt_emissao or '/' not in dt_emissao:
        return None
    partes = dt_emissao.split('/')
    if len(partes) != 3:
        return None
    try:
        return int(partes[2]), int(partes[1])
    except ValueError:
        return None


db = SessionLocal()
try:
    ajustes = db.query(AjusteDevolucao).order_by(
        AjusteDevolucao.empresa_id, AjusteDevolucao.id
    ).all()

    corrigidos, ja_certos, sem_nota, sem_data, divergentes = [], 0, [], [], []

    for aj in ajustes:
        nota = db.query(NotaFiscal).filter(
            NotaFiscal.numero_nf == aj.nf_devolucao,
            NotaFiscal.empresa_id == aj.empresa_id,
        ).first()

        if not nota:
            sem_nota.append(aj)
            continue

        alvo = mes_ano_da_emissao(nota.dt_emissao)
        if not alvo:
            sem_data.append(aj)
            continue

        ano, mes = alvo

        # Conferencia: a entrada sempre espelha a venda. Divergir e sinal de refNFe errada.
        venda = db.query(NotaFiscal).filter(
            NotaFiscal.numero_nf == aj.nf_referenciada,
            NotaFiscal.empresa_id == aj.empresa_id,
        ).first() if aj.nf_referenciada else None
        if venda and venda.valor_nf and abs((aj.valor or 0) - venda.valor_nf) >= 0.005:
            divergentes.append((aj, venda.valor_nf))

        if (aj.ano, aj.mes) == (ano, mes):
            ja_certos += 1
            continue

        corrigidos.append((aj, ano, mes, nota.dt_emissao))
        if APLICAR:
            aj.ano = ano
            aj.mes = mes

    print()
    print('=' * 78)
    print('APLICANDO as mudancas' if APLICAR else 'SIMULACAO — nada sera gravado (use --apply para gravar)')
    print('=' * 78)
    print('Ajustes encontrados: %d' % len(ajustes))
    print()

    if corrigidos:
        print('A REALOCAR (%d):' % len(corrigidos))
        for aj, ano, mes, dt in corrigidos:
            print(
                '  empresa %d · NF devolucao %-10s (emitida %s) · ref NF %-10s · R$ %12.2f'
                % (aj.empresa_id, aj.nf_devolucao, dt, aj.nf_referenciada or '?', aj.valor or 0)
            )
            print('      %02d/%d  ->  %02d/%d' % (aj.mes, aj.ano, mes, ano))
    else:
        print('Nenhum ajuste precisa ser realocado.')

    print()
    print('Ja no mes correto: %d' % ja_certos)

    if sem_nota:
        print()
        print('SEM a nota de devolucao no banco (%d) — nao da para determinar o mes:' % len(sem_nota))
        for aj in sem_nota:
            print('  empresa %d · NF devolucao %s · %02d/%d · R$ %.2f'
                  % (aj.empresa_id, aj.nf_devolucao, aj.mes, aj.ano, aj.valor))
        print('  -> reimporte o XML dessas notas de entrada para corrigi-las.')

    if divergentes:
        print()
        print('CONFERIR (%d) — entrada e venda com valores diferentes:' % len(divergentes))
        for aj, valor_venda in divergentes:
            print('  empresa %d · NF devolucao %s (R$ %.2f) · ref NF %s (R$ %.2f)'
                  % (aj.empresa_id, aj.nf_devolucao, aj.valor or 0, aj.nf_referenciada, valor_venda))
        print('  -> nao existe devolucao parcial, entao isso indica refNFe apontando')
        print('     para a NF errada. O script nao alterou o valor.')

    if sem_data:
        print()
        print('COM data de emissao ilegivel (%d):' % len(sem_data))
        for aj in sem_data:
            print('  empresa %d · NF devolucao %s · %02d/%d'
                  % (aj.empresa_id, aj.nf_devolucao, aj.mes, aj.ano))

    print()
    if APLICAR and corrigidos:
        db.commit()
        print('%d ajuste(s) gravado(s).' % len(corrigidos))
    elif APLICAR:
        print('Nada a gravar.')
    else:
        print('Simulacao concluida. Rode de novo com --apply para gravar.')
    print()
finally:
    db.close()
