import { useState, useRef } from 'react'
import { registrarLog } from '../../api/auditoria'
import api from '../../api/endpoints'


const CNPJ_EMPRESAS: Record<string, string> = {
  'six': '09648409000193',
  'enova': '38345220000120',
}

interface NFParsed {
  numero_nf: string
  destinatario: string
  cnpj_dest: string
  valor_nf: number
  data_emissao: string
  nat_op: string
  status: string
  arquivo: string
  cnpjEmitente?: string
  empresaDetectada?: string
  refNFe?: string
  mesEmissao?: number
  anoEmissao?: number
}

function parseXML(texto: string, arquivo: string): NFParsed | null {
  // Detectar cancelamento
  const isINUT = arquivo.toLowerCase().includes('nfe-inut') || texto.includes('<ProcInutNFe') || texto.includes('xServ>INUTILIZAR')
  if (isINUT) {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(texto, 'application/xml')
      const get = (tag: string) => doc.getElementsByTagName(tag)[0]?.textContent?.trim() || ''
      const nNF = get('nNFIni') || get('nNFFin')
      const xJust = get('xJust')
      const cnpjEmit = get('CNPJ')
      const ano = get('ano')
      const dhEvento = get('dhRecbto') || get('dhRegEvento') || ''
      let dataEvento = ''
      if (dhEvento) {
        const d = new Date(dhEvento)
        if (!isNaN(d.getTime())) dataEvento = String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + d.getFullYear()
      }
      if (!nNF) return null
      const cnpjInutMatch = texto.match(/<CNPJ>(\d+)<\/CNPJ>/)
      const cnpjEmitInut = cnpjInutMatch ? cnpjInutMatch[1] : ''
      return {
        numero_nf: nNF + '-INUT',
        destinatario: 'INUTILIZADA',
        cnpj_dest: '',
        valor_nf: 0,
        data_emissao: dataEvento || ('20' + ano),
        nat_op: 'Inutilizacao',
        status: 'Inutilizacao',
        arquivo,
        cnpjEmitente: cnpjEmitInut,
      }
    } catch { return null }
  }
  const isCCE = arquivo.toLowerCase().includes('nfe-cce') || texto.includes('descEvento>Carta de Correcao') || texto.includes('Carta de Corre')
  const isCAN = !isCCE && (texto.includes('<procEventoNFe') || arquivo.toLowerCase().includes('nfe-can'))
  if (isCCE || isCAN) {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(texto, 'application/xml')
      const get = (tag: string) => doc.getElementsByTagName(tag)[0]?.textContent?.trim() || ''
      const chNFe = get('chNFe')
      const nNF = chNFe ? chNFe.substring(25, 34).replace(/^0+/, '') : ''
      const dhEvento = get('dhEvento')
      let dataEvento = ''
      if (dhEvento) {
        const d = new Date(dhEvento)
        if (!isNaN(d.getTime())) {
          dataEvento = String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + d.getFullYear()
        }
      }
      const xJust = get('xJust')
      const cnpjEmit = get('CNPJ')
      if (!nNF) return null
      // Extrair CNPJ emitente do CCE/CAN via regex
      const cnpjCceMatch = texto.match(/<CNPJ>(\d+)<\/CNPJ>/)
      const cnpjEmitenteCce = cnpjCceMatch ? cnpjCceMatch[1] : ''
      return {
        numero_nf: nNF + (isCCE ? '-CCE' : '-CAN'),
        destinatario: isCCE ? 'CORRECAO: ' + xJust : 'CANCELAMENTO: ' + xJust,
        cnpj_dest: '_lookup_' + nNF,
        valor_nf: 0,
        data_emissao: dataEvento,
        nat_op: isCCE ? 'Carta de Correcao' : 'Cancelamento',
        status: isCCE ? 'Carta de Correcao' : 'Cancelamento',
        arquivo,
        cnpjEmitente: cnpjEmitenteCce,
      }
    } catch { return null }
  }
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(texto, 'application/xml')

    const get = (tag: string) => doc.getElementsByTagName(tag)[0]?.textContent?.trim() || ''

    // Extrair CNPJ do emitente via regex (getElementsByTagName falha com namespace XML)
    const cnpjEmitMatch = texto.match(/<emit>.*?<CNPJ>(\d+)<\/CNPJ>/s) || texto.match(/<emit[^>]*>.*?<CNPJ>(\d+)<\/CNPJ>/s)
    const cnpjEmitente = cnpjEmitMatch ? cnpjEmitMatch[1] : ''

    const numero_nf = get('nNF')
    const destinatario = get('xNome') // primeiro xNome é o emitente, segundo é o destinatário
    // Pegar especificamente o dest > xNome
    const destEl = doc.getElementsByTagName('dest')[0]
    const destNome = destEl?.getElementsByTagName('xNome')[0]?.textContent?.trim() || get('xNome')
    const cnpj = destEl?.getElementsByTagName('CNPJ')[0]?.textContent?.trim() || destEl?.getElementsByTagName('CPF')[0]?.textContent?.trim() || ''
    const valorNF = parseFloat(get('vNF')) || 0
    const dhEmi = get('dhEmi') || get('dEmi')
    const natOp = get('natOp')
    const refNFe = get('refNFe') || ''

    // Converter data para DD/MM/AAAA
    let dataEmissao = ''
    if (dhEmi) {
      const d = new Date(dhEmi)
      if (!isNaN(d.getTime())) {
        dataEmissao = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
      } else if (dhEmi.match(/^\d{4}-\d{2}-\d{2}/)) {
        const [a, m, dia] = dhEmi.split('-')
        dataEmissao = `${dia.substring(0, 2)}/${m}/${a}`
      }
    }

    const status = natOp || 'Venda'

    if (!numero_nf) return null

    return {
      numero_nf,
      destinatario: destNome,
      cnpj_dest: cnpj,
      valor_nf: valorNF,
      data_emissao: dataEmissao,
      nat_op: natOp,
      status,
      arquivo,
      cnpjEmitente,
      refNFe: refNFe || undefined,
      mesEmissao: dataEmissao ? parseInt(dataEmissao.split('/')[1]) : undefined,
      anoEmissao: dataEmissao ? parseInt(dataEmissao.split('/')[2]) : undefined,
    }
  } catch {
    return null
  }
}

export default function ImportarXML() {
  const [dragging, setDragging] = useState(false)
  const [notas, setNotas] = useState<NFParsed[]>([])
  const [erros, setErros] = useState<string[]>([])
  const [importando, setImportando] = useState(false)
  const [resultado, setResultado] = useState<string | null>(null)
  const [creditoPendente, setCreditoPendente] = useState<{nota: any, valorOrig: number} | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

    
  // ==================== IMPORTAR PLANILHA ====================
  const [planilhaNotas, setPlanilhaNotas] = useState<any[]>([])
  const [planilhaErros, setPlanilhaErros] = useState<string[]>([])
  const [importandoPlanilha, setImportandoPlanilha] = useState(false)
  const [resultadoPlanilha, setResultadoPlanilha] = useState<string | null>(null)
  const inputPlanilhaRef = useRef<HTMLInputElement>(null)

  async function processarPlanilha(file: File) {
    const texto = await file.text()
    const linhas = texto.split('\n').filter(l => l.trim())
    if (linhas.length < 2) { setPlanilhaErros(['Arquivo vazio ou inválido']); return }

    // Parser CSV que respeita aspas (campos com vírgula dentro de aspas)
    function parseCSVLine(line: string): string[] {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
          inQuotes = !inQuotes
        } else if ((ch === ',' || ch === ';') && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += ch
        }
      }
      result.push(current.trim())
      return result
    }
    const header = parseCSVLine(linhas[0]).map(h => h.replace(/"/g, '').toLowerCase())
    const sep = ','  // não usado mas mantido para compatibilidade

    // Encontrar índices das colunas
    const idxNF = header.findIndex(h => h.includes('nf') || h.includes('autorizada'))
    const idxValor = header.findIndex(h => h.includes('valor') && !h.includes('receb'))
    const idxData = header.findIndex(h => h.includes('data') || h.includes('recebimento'))
    const idxUnidade = header.findIndex(h => h.includes('unidade'))

    if (idxNF === -1 || idxValor === -1 || idxData === -1) {
      setPlanilhaErros(['Colunas obrigatórias não encontradas: NFes autorizadas, Valor, Data do recebimento'])
      return
    }

    // Buscar notas do sistema
    const [notasSix, notasEnova] = await Promise.all([
      api.get('/notas/1').then(r => r.data).catch(() => []),
      api.get('/notas/2').then(r => r.data).catch(() => []),
    ])
    const todasNotas = [...notasSix.map((n: any) => ({...n, empresa_id: 1})), ...notasEnova.map((n: any) => ({...n, empresa_id: 2}))]

    const resultado: any[] = []
    const erros: string[] = []

    for (let i = 1; i < linhas.length; i++) {
      const cols = parseCSVLine(linhas[i]).map(c => c.replace(/"/g, ''))
      if (!cols[idxNF] || cols[idxNF].trim() === '' || cols[idxNF].includes('&nbsp')) continue

      const nfsLinha = cols[idxNF].split(',').map(n => n.trim()).filter(n => n && !isNaN(Number(n)))
      const valorStr = (cols[idxValor] || '').replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '')
      const valor = parseFloat(valorStr) || 0
      const dataRaw = cols[idxData] || ''
      const dataParts = dataRaw.split(' ')[0] // remover hora
      // Converter para DD/MM/AAAA
      let data = dataParts
      if (dataParts.includes('/') && dataParts.split('/')[2]?.length === 4) {
        data = dataParts // já está no formato correto
      }

      // Filtro de unidade (se disponível)
      const unidade = idxUnidade >= 0 ? (cols[idxUnidade] || '').toLowerCase() : ''

      if (nfsLinha.length === 0) {
        erros.push(`Linha ${i}: nenhum número de NF válido encontrado em "${cols[idxNF]}"`)
        continue
      }

      // Encontrar a nota de Venda entre as NFs da linha
      let notaVenda: any = null
      for (const nfNum of nfsLinha) {
        const nota = todasNotas.find((n: any) => {
          const numMatch = n.numero_nf === nfNum
          const isVenda = (n.nat_operacao || n.status || '').toLowerCase().includes('venda')
          // Filtrar por unidade se disponível
          if (unidade && unidade.includes('six') && n.empresa_id !== 1) return false
          if (unidade && unidade.includes('enova') && n.empresa_id !== 2) return false
          return numMatch && isVenda
        })
        if (nota) { notaVenda = nota; break }
      }

      if (!notaVenda) {
        // Verificar se alguma NF existe mas não é Venda
        const notaExistente = todasNotas.find((n: any) => nfsLinha.includes(n.numero_nf))
        if (notaExistente) {
          erros.push(`Linha ${i}: NFs [${nfsLinha.join(', ')}] — nenhuma é Venda (nat_op: ${notaExistente.nat_operacao || notaExistente.status})`)
        } else {
          erros.push(`Linha ${i}: NFs [${nfsLinha.join(', ')}] não encontradas no sistema`)
        }
        continue
      }

      resultado.push({
        numero_nf: notaVenda.numero_nf,
        empresa_id: notaVenda.empresa_id,
        empresa: notaVenda.empresa_id === 1 ? 'SIX' : 'ENOVA',
        destinatario: notaVenda.destinatario,
        valor_nf: parseFloat(notaVenda.valor_nf) || 0,
        valor_pago: valor,
        data_pagamento: data,
        ja_pago: notaVenda.valor_pago ? parseFloat(notaVenda.valor_pago) > 0 : false,
        valor_atual: parseFloat(notaVenda.valor_pago) || 0,
        id: notaVenda.id,
      })
    }

    setPlanilhaNotas(resultado)
    setPlanilhaErros(erros)
    setResultadoPlanilha(null)
  }

  async function importarPlanilha() {
    if (planilhaNotas.length === 0) return
    setImportandoPlanilha(true)
    try {
      let ok = 0
      for (const n of planilhaNotas) {
        await api.post('/notas/pagamento', {
          empresa_id: n.empresa_id,
          numero_nf: n.numero_nf,
          valor_pago: parseFloat(String(n.valor_pago)) || 0,
          dt_pagamento: String(n.data_pagamento).split(' ')[0],
        })
        ok++
      }
      setResultadoPlanilha(`✅ ${ok} pagamento${ok !== 1 ? 's' : ''} lançado${ok !== 1 ? 's' : ''} com sucesso!`)
      setPlanilhaNotas([])
    } catch (err: any) {
      setResultadoPlanilha(`❌ Erro: ${err?.response?.data?.detail || err.message}`)
    } finally {
      setImportandoPlanilha(false)
    }
  }

  const corEmp = '#4F8EF7'
  const bgEmp = '#1C2E52'
  const mono = { fontFamily: 'monospace' }

  async function processarArquivos(files: FileList) {
    const novasNotas: NFParsed[] = []
    const novosErros: string[] = []

    for (const file of Array.from(files)) {
      if (!file.name.endsWith('.xml')) {
        novosErros.push(`${file.name} — não é um arquivo XML`)
        continue
      }
      const texto = await file.text()
      const nf = parseXML(texto, file.name)
      if (nf) {
        // Detectar empresa pelo CNPJ do emitente
        const empresaDetectada = nf.cnpjEmitente === '09648409000193' ? 'six' : nf.cnpjEmitente === '38345220000120' ? 'enova' : null
        if (!empresaDetectada) {
          novosErros.push(`${file.name} — CNPJ emitente (${nf.cnpjEmitente || 'não encontrado'}) não reconhecido`)
        } else {
          novasNotas.push({...nf, empresaDetectada})
        }
      } else {
        novosErros.push(`${file.name} — não foi possível extrair dados da NF`)
      }
    }

    setNotas(prev => {
      // Evitar duplicatas por numero_nf
      const existentes = new Set(prev.map(n => n.numero_nf))
      return [...prev, ...novasNotas.filter(n => !existentes.has(n.numero_nf))]
    })
    setErros(prev => [...prev, ...novosErros])
    setResultado(null)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length > 0) processarArquivos(e.dataTransfer.files)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) processarArquivos(e.target.files)
  }

  async function importar() {
    if (notas.length === 0) return
    setImportando(true)
    try {
      let importadas = 0
      for (const nota of notas) {
        // Se for CAN ou CCE, buscar destinatario/cnpj da nota original
        const empIdDetectado = (nota as any).empresaDetectada === 'six' ? 1 : 2
        let notaFinal = { ...nota, empresa_id: empIdDetectado }
        if (nota.cnpj_dest?.startsWith('_lookup_')) {
          const nNFOrig = nota.cnpj_dest.replace('_lookup_', '')
          const orig = notas.find(n => n.numero_nf === nNFOrig)
          if (orig) {
            notaFinal.destinatario = orig.destinatario
            notaFinal.cnpj_dest = orig.cnpj_dest
          } else {
            // Buscar no banco
            try {
              const res = await api.get('/notas/' + empIdDetectado)
              const origDb = res.data.find((n: any) => n.numero_nf === nNFOrig)
              if (origDb) {
                notaFinal.destinatario = origDb.destinatario
                notaFinal.cnpj_dest = origDb.cnpj_dest
              } else {
                notaFinal.cnpj_dest = ''
              }
            } catch { notaFinal.cnpj_dest = '' }
          }
        }
        await api.post('/notas/importar', notaFinal)
        importadas++
        // Se for devolucao com refNFe: registrar ajuste para subtrair do RBT12
        const isDev = (notaFinal.nat_op || '').toLowerCase().includes('devolu')
        if (isDev && notaFinal.refNFe && notaFinal.refNFe.length >= 25) {
          const chave = notaFinal.refNFe
          const anoOrig = parseInt('20' + chave.substring(2, 4))
          const mesOrig = parseInt(chave.substring(4, 6))
          const nfOrig = chave.substring(25, 34).replace(/^0+/, '')
          try {
            await api.post('/notas/ajustes', {
              empresa_id: empIdDetectado, ano: anoOrig, mes: mesOrig,
              valor: notaFinal.valor_nf, nf_devolucao: notaFinal.numero_nf,
              nf_referenciada: nfOrig, chave_ref: chave
            })
            } catch(e) { console.warn('Ajuste devolucao nao registrado', e) }
        }
      }
      // Atualizar historico de faturamento se houver notas de venda  const notasVenda = notas.filter(n => n.status === 'Venda')
      if (notasVenda.length > 0) {
        // Agrupar por mês/ano
        const porMes: Record<string, number> = {}
        notasVenda.forEach(n => {
          if (n.data_emissao) {
            const [, m, a] = n.data_emissao.split('/')
            const key = `${a}-${m}`
            porMes[key] = (porMes[key] || 0) + n.valor_nf
          }
        })
      }
              for (const key of Object.keys(porMes)) {
          const [a, m] = key.split('-')
          await historicoAPI.upsert({ empresa_id: empIdDetectado, ano: +a, mes: +m, valor: porMes[key] })
        }
      }
      setResultado(`✅ ${importadas} nota${importadas !== 1 ? 's' : ''} importada${importadas !== 1 ? 's' : ''} com sucesso!${notasVenda.length > 0 ? ` · Planilha_2 atualizada` : ''}`)
      await registrarLog({ acao: 'IMPORTAR', modulo: 'notas', descricao: `${importadas} nota${importadas !== 1 ? 's' : ''} importada${importadas !== 1 ? 's' : ''} via XML · ${notasVenda.length} Venda`, valorDepois: { total: importadas, vendas: notasVenda.length, notas: notas.map(n => n.numero_nf) } })
      setNotas([])
    } catch (err: any) {
      setResultado(`❌ Erro ao importar: ${err?.response?.data?.detail || err.message}`)
    } finally {
      setImportando(false)
    }
  }

  function remover(nf: string) {
    setNotas(prev => prev.filter(n => n.numero_nf !== nf))
  }

  const notasVenda = notas.filter(n => n.status === 'Venda')
  const totalVenda = notasVenda.reduce((s, n) => s + n.valor_nf, 0)

  function fmtR(v: number) {
    return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  }
  function fmtCNPJ(v: string) {
    if (!v) return '—'
    const n = v.replace(/\D/g, '')
    if (n.length === 14) return n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    return v
  }

  const st = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', marginTop: '22px', display: 'flex', alignItems: 'center', gap: '8px' }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4A5070', marginBottom: '16px' }}>
        <span>Início</span><span style={{ margin: '0 4px' }}>›</span>
        <span style={{ color: '#7B82A0' }}>Importar XML</span>
      </div>

      {/* Drop zone */}
      <div style={{ ...st, marginTop: 0 }}>
        Arquivos XML — NF-e
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1px dashed ${dragging ? corEmp : '#333750'}`,
          borderRadius: '14px', padding: '32px',
          textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(79,142,247,0.06)' : '#13161F',
          transition: 'all .2s', marginBottom: '16px',
        }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📄</div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#E8EAF0', marginBottom: '4px' }}>Clique ou arraste os arquivos XML</div>
        <div style={{ fontSize: '11px', color: '#7B82A0' }}>Somente natOp = "Venda" entra no faturamento da Planilha_2</div>
        <input ref={inputRef} type="file" accept=".xml" multiple onChange={onFileChange} style={{ display: 'none' }} />
      </div>

      {/* Campos automáticos */}
      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '8px' }}>Campos preenchidos automaticamente</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {[
            ['Nº NF', '<nNF>'],
            ['Destinatário', '<dest><xNome>'],
            ['CNPJ', '<dest><CNPJ>'],
            ['Valor NF', '<vNF>'],
            ['Dt. Emissão', '<dhEmi>'],
            ['Nat. Operação', '<natOp>'],
          ].map(([label, tag]) => (
            <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#7B82A0' }}>
              <span>📌 {label} ←</span>
              <span style={{ background: '#1A1D2A', border: '1px solid #252836', borderRadius: '4px', padding: '1px 5px', ...mono, fontSize: '10px', color: corEmp }}>{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info lançamento automático */}
      <div style={{ background: '#0D3326', border: '1px solid #134D38', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 500, marginBottom: '3px' }}>📤 Lançamento automático na Planilha_2</div>
        <div style={{ fontSize: '11px', color: '#7B82A0' }}>
          Somatória das NFs de <strong style={{ color: '#34D399' }}>Venda</strong> do mês será gravada automaticamente no histórico de faturamento · Empresa detectada pelo CNPJ do emitente
        </div>
      </div>

      {/* Erros */}
      {erros.length > 0 && (
        <div style={{ background: '#3B1010', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px' }}>
          {erros.map((e, i) => <div key={i} style={{ fontSize: '11px', color: '#F87171', marginBottom: '3px' }}>⚠️ {e}</div>)}
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <div style={{ background: resultado.startsWith('✅') ? '#0D3326' : '#3B1010', border: `1px solid ${resultado.startsWith('✅') ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`, borderRadius: '14px', padding: '12px 16px', marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: resultado.startsWith('✅') ? '#34D399' : '#F87171' }}>
          {resultado}
        </div>
      )}

      {/* Preview das notas */}
      {notas.length > 0 && (
        <>
          <div style={st}>
            Preview — {notas.length} nota{notas.length !== 1 ? 's' : ''} carregada{notas.length !== 1 ? 's' : ''}
            <div style={{ flex: 1, height: '1px', background: '#252836' }} />
            {notasVenda.length > 0 && (
              <span style={{ fontSize: '10px', color: '#34D399', fontWeight: 500 }}>
                {notasVenda.length} Venda · {fmtR(totalVenda)}
              </span>
            )}
          </div>

          <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#1A1D2A' }}>
                    {['Nº NF', 'Destinatário', 'CNPJ', 'Valor NF', 'Dt. Emissão', 'Nat. Operação', 'Status', ''].map((h, i) => (
                      <th key={i} style={{ padding: '8px 12px', textAlign: ['Valor NF'].includes(h) ? 'right' : 'left', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#4A5070', borderBottom: '1px solid #252836', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notas.map(n => (
                    <tr key={n.numero_nf}>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836' }}>
                        <span style={{ ...mono, fontSize: '12px', fontWeight: 700, color: (n as any).empresaDetectada === 'enova' ? '#34D399' : '#4F8EF7', background: (n as any).empresaDetectada === 'enova' ? '#0D3326' : '#1C2E52', padding: '2px 8px', borderRadius: '6px' }}>{n.numero_nf}</span>
                      </td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', color: '#7B82A0', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.destinatario || '—'}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', ...mono, fontSize: '11px', color: '#7B82A0' }}>{fmtCNPJ(n.cnpj_dest)}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', fontWeight: 600, color: '#E8EAF0' }}>{fmtR(n.valor_nf)}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', ...mono, fontSize: '11px', color: '#7B82A0' }}>{n.data_emissao || '—'}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', fontSize: '11px', color: '#7B82A0', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.nat_op || '—'}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, background: n.status === 'Venda' ? 'rgba(52,211,153,0.15)' : 'rgba(123,130,160,0.15)', color: n.status === 'Venda' ? '#34D399' : '#7B82A0' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: n.status === 'Venda' ? '#34D399' : '#7B82A0' }} />
                          {n.status}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', textAlign: 'center' }}>
                        <button onClick={() => remover(n.numero_nf)} style={{ padding: '3px 8px', background: '#3B1010', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '5px', color: '#F87171', fontSize: '11px', cursor: 'pointer' }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#1A1D2A' }}>
                    <td colSpan={3} style={{ padding: '8px 12px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#7B82A0', borderTop: '2px solid #333750' }}>
                      {notasVenda.length} de {notas.length} são Venda
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#34D399', borderTop: '2px solid #333750' }}>{fmtR(totalVenda)}</td>
                    <td colSpan={4} style={{ borderTop: '2px solid #333750' }} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setNotas([]); setErros([]); setResultado(null) }}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #252836', borderRadius: '6px', color: '#7B82A0', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button onClick={importar} disabled={importando}
              style={{ padding: '8px 20px', background: '#1C2E52', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '6px', color: corEmp, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {importando ? 'Importando...' : `📥 Importar ${notas.length} nota${notas.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </>
      )}

      {/* ==================== IMPORTAR PLANILHA ==================== */}
      <div style={{ ...st, marginTop: '24px' }}>
        Importar Planilha de Recebimentos
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>

      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#7B82A0', marginBottom: '12px' }}>
          📋 Lê arquivo CSV com colunas: <strong style={{ color: '#E8EAF0' }}>Unidade, NFes autorizadas, Valor, Data do recebimento</strong><br/>
          O sistema identifica automaticamente a nota de Venda entre as NFs e lança o pagamento.
        </div>
        <button onClick={() => inputPlanilhaRef.current?.click()}
          style={{ padding: '8px 18px', background: '#1C2E52', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '8px', color: '#4F8EF7', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          📂 Selecionar CSV
        </button>
        <input ref={inputPlanilhaRef} type="file" accept=".csv,.xls" onChange={e => { if (e.target.files?.[0]) processarPlanilha(e.target.files[0]) }} style={{ display: 'none' }} />
      </div>

      {planilhaErros.length > 0 && (
        <div style={{ background: '#3B1010', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px' }}>
          {planilhaErros.map((e, i) => <div key={i} style={{ fontSize: '11px', color: '#F87171', marginBottom: '3px' }}>⚠️ {e}</div>)}
        </div>
      )}

      {resultadoPlanilha && (
        <div style={{ background: resultadoPlanilha.startsWith('✅') ? '#0D3326' : '#3B1010', border: `1px solid ${resultadoPlanilha.startsWith('✅') ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`, borderRadius: '14px', padding: '12px 16px', marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: resultadoPlanilha.startsWith('✅') ? '#34D399' : '#F87171' }}>
          {resultadoPlanilha}
        </div>
      )}

      {planilhaNotas.length > 0 && (
        <>
          <div style={{ ...st }}>
            Preview — {planilhaNotas.length} pagamento{planilhaNotas.length !== 1 ? 's' : ''} identificado{planilhaNotas.length !== 1 ? 's' : ''}
            <div style={{ flex: 1, height: '1px', background: '#252836' }} />
          </div>
          <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#1A1D2A' }}>
                    {['Empresa','Nº NF','Destinatário','Valor NF','Valor Pago','Data Pagto','Status'].map((h, i) => (
                      <th key={i} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#4A5070', borderBottom: '1px solid #252836', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {planilhaNotas.map((n, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #252836' }}>
                      <td style={{ padding: '8px 12px', color: n.empresa_id === 1 ? '#4F8EF7' : '#34D399', fontWeight: 600, fontSize: '11px' }}>{n.empresa}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: n.empresa_id === 1 ? '#4F8EF7' : '#34D399', fontFamily: 'monospace' }}>{n.numero_nf}</td>
                      <td style={{ padding: '8px 12px', color: '#7B82A0', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.destinatario}</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '11px', color: '#E8EAF0' }}>{fmtR(n.valor_nf)}</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '11px', fontWeight: 600, color: '#34D399' }}>{fmtR(n.valor_pago)}</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '11px', color: '#7B82A0' }}>{n.data_pagamento}</td>
                      <td style={{ padding: '8px 12px' }}>
                        {n.ja_pago
                          ? <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, background: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}>⚠️ Já tem pagamento</span>
                          : <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, background: 'rgba(52,211,153,0.15)', color: '#34D399' }}>✓ Novo</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setPlanilhaNotas([]); setPlanilhaErros([]); setResultadoPlanilha(null) }}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #252836', borderRadius: '6px', color: '#7B82A0', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button onClick={importarPlanilha} disabled={importandoPlanilha}
              style={{ padding: '8px 20px', background: '#1C2E52', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '6px', color: '#4F8EF7', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {importandoPlanilha ? 'Lançando...' : `💾 Lançar ${planilhaNotas.length} pagamento${planilhaNotas.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
 
 
 
 
