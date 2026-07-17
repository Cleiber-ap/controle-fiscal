const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar opcao "Sem contabilizacao" logo apos "Contabilização: todos"
const anchor1 = "<option value=\"\">Contabilização: todos</option>";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  c = c.slice(0, idx1 + anchor1.length) + "\r\n                <option value=\"__VAZIO__\">Sem contabilização</option>" + c.slice(idx1 + anchor1.length);
  console.log("OK: opcao adicionada no select");
}

// 2. Ajustar logica do notasFiltradas5 para tratar o valor especial
const anchor2 = "const notasFiltradas5 = filtroMesContb ? notasFiltradas4.filter((r: any) => {\r\n" +
"    const lista = pagamentos[r.numero_nf] || []\r\n" +
"    if (lista.length > 0) {\r\n" +
"      return lista.some((p: any) => {\r\n" +
"        const dt = p.data_contabilizacao || ''\r\n" +
"        const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2,'0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return (mm + '/' + aa) === filtroMesContb\r\n" +
"      })\r\n" +
"    }\r\n" +
"    const dtC = r.data_contabilizacao || ''\r\n" +
"    if (!dtC) return false\r\n" +
"    const parts = dtC.includes('-') ? dtC.split('-').reverse() : dtC.split('/')\r\n" +
"    const mm = parts[1]?.padStart(2,'0')\r\n" +
"    const aa = parts[2]\r\n" +
"    return (mm + '/' + aa) === filtroMesContb\r\n" +
"  }) : notasFiltradas4";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "const notasFiltradas5 = filtroMesContb ? notasFiltradas4.filter((r: any) => {\r\n" +
"    const lista = pagamentos[r.numero_nf] || []\r\n" +
"    if (filtroMesContb === '__VAZIO__') {\r\n" +
"      if (lista.length > 0) {\r\n" +
"        return lista.some((p: any) => !p.data_contabilizacao)\r\n" +
"      }\r\n" +
"      return !r.data_contabilizacao\r\n" +
"    }\r\n" +
"    if (lista.length > 0) {\r\n" +
"      return lista.some((p: any) => {\r\n" +
"        const dt = p.data_contabilizacao || ''\r\n" +
"        const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2,'0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return (mm + '/' + aa) === filtroMesContb\r\n" +
"      })\r\n" +
"    }\r\n" +
"    const dtC = r.data_contabilizacao || ''\r\n" +
"    if (!dtC) return false\r\n" +
"    const parts = dtC.includes('-') ? dtC.split('-').reverse() : dtC.split('/')\r\n" +
"    const mm = parts[1]?.padStart(2,'0')\r\n" +
"    const aa = parts[2]\r\n" +
"    return (mm + '/' + aa) === filtroMesContb\r\n" +
"  }) : notasFiltradas4";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK: logica do filtro atualizada para tratar __VAZIO__");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
