const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

const OLD = `    const buildSheet = (lista: any[], emp: string) => {
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
    }`;

const NEW = `    const buildSheet = (lista: any[], emp: string) => {
      const rows = linhas(lista, emp)
      const nRows = rows.length
      const sumRow: any[] = ["","","","",{f:"SUM(E2:E"+(nRows+1)+")"}]
      const ws = XLSX.utils.aoa_to_sheet([cab,...rows,[],sumRow])
      const border = { top:{style:"thin",color:{rgb:"000000"}}, bottom:{style:"thin",color:{rgb:"000000"}}, left:{style:"thin",color:{rgb:"000000"}}, right:{style:"thin",color:{rgb:"000000"}} }
      const ncols = cab.length
      // Header: laranja + borda
      cab.forEach((_: any, ci: number) => {
        const a = XLSX.utils.encode_cell({r:0,c:ci})
        if(ws[a]) ws[a].s = { ...hSt, border }
      })
      // Linhas de dados: fundo alternado + borda
      rows.forEach((row: any[], ri: number) => {
        const bgColor = ri % 2 === 0 ? "FFFFFF" : "ECECEC"
        row.forEach((val: any, ci: number) => {
          const a = XLSX.utils.encode_cell({r:ri+1,c:ci})
          if(!ws[a]) ws[a] = {t:"z"}
          ws[a].s = {
            font:{name:"Calibri",sz:11},
            alignment:{horizontal:aligns[ci]||"left"},
            fill:{patternType:"solid",fgColor:{rgb:bgColor}},
            border
          }
          if((ci===5||ci===7) && row[ci] instanceof Date) ws[a].z = "dd/mm/yyyy"
        })
        // Garantir borda em células vazias da linha
        for(let ci = 0; ci < ncols; ci++){
          const a = XLSX.utils.encode_cell({r:ri+1,c:ci})
          if(!ws[a]) ws[a] = {t:"z"}
          if(!ws[a].s) ws[a].s = {}
          ws[a].s.border = border
          if(!ws[a].s.fill) ws[a].s.fill = {patternType:"solid",fgColor:{rgb: ri%2===0?"FFFFFF":"ECECEC"}}
        }
      })
      // Linha de somatória: fundo preto em todas as células, célula E em branco
      const sumRowIdx = nRows + 2
      for(let ci = 0; ci < ncols; ci++){
        const a = XLSX.utils.encode_cell({r:sumRowIdx,c:ci})
        if(!ws[a]) ws[a] = {t:"z"}
        if(!ws[a].s) ws[a].s = {}
        const isSum = ci === 4
        ws[a].s = {
          fill:{patternType:"solid",fgColor:{rgb: isSum ? "FFFFFF" : "000000"}},
          font:{name:"Calibri",sz:11,bold:isSum, color:{rgb: isSum ? "000000" : "000000"}},
          border
        }
      }
      ws["!cols"] = [{wch:11},{wch:43},{wch:17},{wch:52},{wch:18},{wch:13},{wch:17},{wch:17},{wch:17}]
      return ws
    }`;

c = c.replace(OLD, NEW);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("ECECEC") && c.includes("sumRowIdx") ? "OK" : "FALHOU");
