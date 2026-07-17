const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Novo state
const a1 = "const [filtroTipo, setFiltroTipo] = useState('\'\')";
const anchor1 = "const [filtroTipo, setFiltroTipo] = useState(\x27\x27)";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  c = c.slice(0, idx1) + anchor1 + "\r\n  const [filtroMesContb, setFiltroMesContb] = useState(\x27\x27)" + c.slice(idx1 + anchor1.length);
  console.log("OK: state adicionado");
}

// 2. Novo select, logo apos o select de Pagamento
const anchor2 = "))].filter(Boolean).sort().map((m:any)=>(<option key={m} value={m}>{m}</option>))}\r\n              </select>\r\n              <div style={{ position: \x27relative\x27 }}>";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novoSelect = "\r\n              <select value={filtroMesContb} onChange={e=>setFiltroMesContb(e.target.value)} style={{ background:\x27#1A1D2A\x27, color:\x27#E8EAF0\x27, border:\x271px solid #353849\x27, borderRadius:6, padding:\x272px 8px\x27, fontSize:\x2712px\x27, cursor:\x27pointer\x27 }}>\r\n                <option value=\"\">Contabilização: todos</option>\r\n                {[...new Set(notas.flatMap((r:any)=>{\r\n                  const lista=pagamentos[r.numero_nf]||[]\r\n                  if(lista.length>0) return lista.map((p:any)=>{ const dt=p.data_contabilizacao||\x27\x27; if(!dt) return null; const parts=dt.includes(\x27-\x27)?dt.split(\x27-\x27).reverse():dt.split(\x27/\x27); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,\x270\x27)+\x27/\x27+aa : null }).filter(Boolean)\r\n                  const dtC=r.data_contabilizacao||\x27\x27; if(!dtC) return []; const parts=dtC.includes(\x27-\x27)?dtC.split(\x27-\x27).reverse():dtC.split(\x27/\x27); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? [mm.padStart(2,\x270\x27)+\x27/\x27+aa] : []\r\n                }))].filter(Boolean).sort().map((m:any)=>(<option key={m} value={m}>{m}</option>))}\r\n              </select>";
  c = c.slice(0, idx2 + anchor2.indexOf("</select>") + "</select>".length) + novoSelect + c.slice(idx2 + anchor2.indexOf("</select>") + "</select>".length);
  console.log("OK: select adicionado");
}

// 3. notasFiltradas5 + trocar notasFiltradas4.map por notasFiltradas5.map
const anchor3 = "}) : notasFiltradas3\r\n  const dtNoMesFiltro";
const idx3 = c.indexOf(anchor3);
if (idx3 === -1) { console.log("FALHOU: anchor3"); ok = false; }
else {
  const novo3 = "}) : notasFiltradas3\r\n  const notasFiltradas5 = filtroMesContb ? notasFiltradas4.filter((r: any) => {\r\n    const lista = pagamentos[r.numero_nf] || []\r\n    if (lista.length > 0) {\r\n      return lista.some((p: any) => {\r\n        const dt = p.data_contabilizacao || \x27\x27\r\n        const parts = dt.includes(\x27-\x27) ? dt.split(\x27-\x27).reverse() : dt.split(\x27/\x27)\r\n        const mm = parts[1]?.padStart(2,\x270\x27)\r\n        const aa = parts[2]\r\n        return (mm + \x27/\x27 + aa) === filtroMesContb\r\n      })\r\n    }\r\n    const dtC = r.data_contabilizacao || \x27\x27\r\n    if (!dtC) return false\r\n    const parts = dtC.includes(\x27-\x27) ? dtC.split(\x27-\x27).reverse() : dtC.split(\x27/\x27)\r\n    const mm = parts[1]?.padStart(2,\x270\x27)\r\n    const aa = parts[2]\r\n    return (mm + \x27/\x27 + aa) === filtroMesContb\r\n  }) : notasFiltradas4\r\n  const dtNoMesFiltro";
  c = c.slice(0, idx3) + novo3 + c.slice(idx3 + anchor3.length);
  console.log("OK: notasFiltradas5 criado");
}

// 4. trocar notasFiltradas4.map por notasFiltradas5.map
const anchor4 = "{notasFiltradas4.map(r => {";
const idx4 = c.indexOf(anchor4);
if (idx4 === -1) { console.log("FALHOU: anchor4"); ok = false; }
else {
  c = c.slice(0, idx4) + "{notasFiltradas5.map(r => {" + c.slice(idx4 + anchor4.length);
  console.log("OK: tabela usa notasFiltradas5");
}

// 5. Footer: incluir filtroMesContb na condicao e trocar base para notasFiltradas5
const anchor5 = "{fmtR((filtroMesEmissao || filtroMesPagto || filtroTipo) ? notasFiltradas3.filter((r:any) => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s:number,r:any) => s + (parseFloat(r.valor_nf)||0), 0) : tNF)}";
const idx5 = c.indexOf(anchor5);
if (idx5 === -1) { console.log("FALHOU: anchor5"); ok = false; }
else {
  const novo5 = "{fmtR((filtroMesEmissao || filtroMesPagto || filtroTipo || filtroMesContb) ? notasFiltradas5.filter((r:any) => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s:number,r:any) => s + (parseFloat(r.valor_nf)||0), 0) : tNF)}";
  c = c.replace(anchor5, novo5);
  console.log("OK: footer NF atualizado");
}

const anchor6 = "{fmtR((filtroMesEmissao || filtroMesPagto || filtroTipo) ? notasFiltradas3.filter((r:any) => r.valor_pago).reduce((s:number,r:any) => s + (parseFloat(r.valor_pago)||0), 0) : tPago)}";
const idx6 = c.indexOf(anchor6);
if (idx6 === -1) { console.log("FALHOU: anchor6"); ok = false; }
else {
  const novo6 = "{fmtR((filtroMesEmissao || filtroMesPagto || filtroTipo || filtroMesContb) ? notasFiltradas5.filter((r:any) => r.valor_pago).reduce((s:number,r:any) => s + (parseFloat(r.valor_pago)||0), 0) : tPago)}";
  c = c.replace(anchor6, novo6);
  console.log("OK: footer Pago atualizado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - filtro Contabilizacao implementado"); }
else console.log("Corrigir ancoras antes de continuar");
