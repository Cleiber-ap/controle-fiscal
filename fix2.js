const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
const start = c.indexOf("  async function exportarMesAnterior() {");
const endMarker = "    setGerando(null)\n  }\n";
const endIdx = c.indexOf(endMarker, start) + endMarker.length;
if(start === -1){ console.log("START NOT FOUND"); process.exit(1); }
const NEW = `  async function exportarMesAnterior() {
    setGerando("mes")
    const wb = XLSX.utils.book_new()
    const cab = ["N\u00ba NF","RzEmit","CnpjDest","RzDest","Valor NF","DtEmissao","Valor Pago","Data do Pagto","Status Nota Fiscal"]
    const parseDate = (dtStr: any): Date | null => {
      if (!dtStr) return null
      if (dtStr instanceof Date) return dtStr as Date
      const s = String(dtStr)
      const parts = s.includes("-") ? s.split("-").reverse() : s.split("/")
      const d = new Date(+parts[2], +parts[1] - 1, +parts[0])
      return isNaN(d.getTime()) ? null : d
    }
    const linhas = (lista: any[], emp: string) => {
      const rows: any[][] = []
      const nfsCan = new Set(lista.filter((n: any) => n.numero_nf?.endsWith("-CAN")).map((n: any) => n.numero_nf.replace("-CAN","")))
      const listaFiltrada = lista.filter((n: any) => { const st = (n.nat_operacao || n.status || "").toLowerCase(); return !st.includes("cancelamento") && !st.includes("cce") && !st.includes("carta") })
      const notasMes = listaFiltrada.filter((n: any) => {
        if (!n.data_emissao) return false
        const parts = n.data_emissao.includes("-") ? n.data_emissao.split("-") : n.data_emissao.split("/").reverse()
        return parseInt(parts[1]) === mesAntIdx + 1 && parseInt(parts[0]) === anoAnt
      })
      const notasAguardando = listaFiltrada.filter((n: any) => {
        const st = (n.nat_operacao || n.status || "").toLowerCase()
        const isVenda = st.includes("venda")
        const semPagamento = !n.valor_pago || parseFloat(n.valor_pago) === 0
        const foiCancelada = nfsCan.has(n.numero_nf)
        const dt = n.data_emissao
        if (!dt) return false
        const parts = dt.includes("-") ? dt.split("-") : dt.split("/").reverse()
        const noMesAnt = parseInt(parts[1]) === mesAntIdx + 1 && parseInt(parts[0]) === anoAnt
        return isVenda && semPagamento && !foiCancelada && !noMesAnt
      })
      const notasPagas = listaFiltrada.filter((n: any) => {
        const pgtos = pagamentos[n.numero_nf] || []
        if (pgtos.length === 0) {
          const dtP = n.dt_pagamento || n.data_pagamento
          if (!dtP) return false
          const parts = dtP.includes("-") ? dtP.split("-") : dtP.split("/").reverse()
          return parseInt(parts[1]) === mesAntIdx + 1 && parseInt(parts[0]) === anoAnt
        }
        return pgtos.some((p: any) => {
          const dt = p.dt_pagamento
          if (!dt) return false
          const parts = dt.includes("-") ? dt.split("-") : dt.split("/").reverse()
          return parseInt(parts[1]) === mesAntIdx + 1 && parseInt(parts[0]) === anoAnt
        })
      })
      const todasNotas = [...new Map([...notasMes, ...notasAguardando, ...notasPagas].map((n: any) => [n.numero_nf, n])).values()].sort((a: any, b: any) => { const na = parseFloat(a.numero_nf) || 0; const nb = parseFloat(b.numero_nf) || 0; return na - nb })
      for (const n of todasNotas) {
        const pgtos = pagamentos[n.numero_nf] || []
        const dtEm = parseDate(n.data_emissao)
        if (pgtos.length > 0) {
          pgtos.forEach((p: any) => {
            rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,parseFloat(p.valor_pago)||0,parseDate(p.dt_pagamento),n.nat_operacao||n.status||""])
          })
        } else {
          rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,n.valor_pago?parseFloat(n.valor_pago):null,parseDate(n.dt_pagamento||n.data_pagamento),n.nat_operacao||n.status||""])
        }
      }
      return rows
    }
    const hSt = {font:{bold:true,name:"Calibri",sz:11},fill:{patternType:"solid",fgColor:{rgb:"FFC000"}},alignment:{horizontal:"center",vertical:"center"}}
    const aligns = ["center","center","center","left","left","center","center","center","center"]
    const buildSheet = (lista: any[], emp: string) => {
      const rows = linhas(lista, emp)
      const nRows = rows.length
      const sumRow: any[] = ["","","","",{f:"SUM(E2:E"+(nRows+1)+")"}]
      const ws = XLSX.utils.aoa_to_sheet([cab,...rows,[],sumRow])
      cab.forEach((_: any, ci: number) => { const a = XLSX.utils.encode_cell({r:0,c:ci}); if(ws[a]) ws[a].s = hSt })
      rows.forEach((row: any[], ri: number) => {
        row.forEach((val: any, ci: number) => {
          const a = XLSX.utils.encode_cell({r:ri+1,c:ci})
          if(!ws[a]) return
          ws[a].s = {font:{name:"Calibri",sz:11},alignment:{horizontal:aligns[ci]||"left"}}
          if((ci===5||ci===7) && row[ci] instanceof Date) ws[a].z = "dd/mm/yyyy"
        })
      })
      ws["!cols"] = [{wch:11},{wch:43},{wch:17},{wch:52},{wch:18},{wch:13},{wch:17},{wch:17},{wch:17}]
      return ws
    }
    XLSX.utils.book_append_sheet(wb, buildSheet(notas.six,"SIX COMERCIAL ARTIGOS PROMOCIONAIS"), "SIX Comercial")
    XLSX.utils.book_append_sheet(wb, buildSheet(notas.enova,"ENOVA COMERCIAL ARTIGOS PROMOCIONAIS"), "ENOVA Comercial")
    XLSX.writeFile(wb, "relatorio_completo.xlsx", {cellStyles:true})
    await registrarLog({ acao: "EXPORTAR", modulo: "excel", descricao: "Relatorio completo exportado" })
    showNotif("Relatorio gerado!")
    setGerando(null)
  }
`;
c = c.slice(0, start) + NEW + c.slice(endIdx);
fs.writeFileSync(f, c, "utf8");
console.log("OK:", c.includes("buildSheet") && c.includes("parseDate"));
