const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar opcao no select
const anchor1 = "<option value=\"\">Pagamento: todos</option>";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  c = c.slice(0, idx1 + anchor1.length) + "\r\n                <option value=\"__VAZIO__\">Sem pagamento</option>" + c.slice(idx1 + anchor1.length);
  console.log("OK: opcao adicionada no select Pagamento");
}

// 2. notasFiltradas: tratar __VAZIO__
const anchor2 = "const notasFiltradas = filtroMesPagto\r\n" +
"    ? ultimos4.filter(r => {\r\n" +
"        const lista = pagamentos[r.numero_nf] || []\r\n" +
"        const dtPgto = r.dt_pagamento || r.data_pagamento\r\n" +
"        if (lista.length > 0) {\r\n" +
"          return lista.some((p: any) => {\r\n" +
"            const dt = p.dt_pagamento || ''\r\n" +
"            const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')\r\n" +
"            const mm = parts[1]?.padStart(2,'0')\r\n" +
"            const aa = parts[2]\r\n" +
"            return (mm + '/' + aa) === filtroMesPagto\r\n" +
"          })\r\n" +
"        }\r\n" +
"        if (!dtPgto) return false\r\n" +
"        const parts = dtPgto.includes('-') ? dtPgto.split('-').reverse() : dtPgto.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2,'0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return (mm + '/' + aa) === filtroMesPagto\r\n" +
"      })\r\n" +
"    : ultimos4";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "const notasFiltradas = filtroMesPagto\r\n" +
"    ? ultimos4.filter(r => {\r\n" +
"        const lista = pagamentos[r.numero_nf] || []\r\n" +
"        const dtPgto = r.dt_pagamento || r.data_pagamento\r\n" +
"        if (filtroMesPagto === '__VAZIO__') {\r\n" +
"          return lista.length === 0 && !dtPgto\r\n" +
"        }\r\n" +
"        if (lista.length > 0) {\r\n" +
"          return lista.some((p: any) => {\r\n" +
"            const dt = p.dt_pagamento || ''\r\n" +
"            const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')\r\n" +
"            const mm = parts[1]?.padStart(2,'0')\r\n" +
"            const aa = parts[2]\r\n" +
"            return (mm + '/' + aa) === filtroMesPagto\r\n" +
"          })\r\n" +
"        }\r\n" +
"        if (!dtPgto) return false\r\n" +
"        const parts = dtPgto.includes('-') ? dtPgto.split('-').reverse() : dtPgto.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2,'0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return (mm + '/' + aa) === filtroMesPagto\r\n" +
"      })\r\n" +
"    : ultimos4";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK: notasFiltradas trata __VAZIO__");
}

// 3. dtNoMesFiltro: tratar __VAZIO__
const anchor3 = "const dtNoMesFiltro = (dtStr: string | undefined) => {\r\n" +
"    if (!filtroMesPagto || !dtStr) return !filtroMesPagto\r\n";
const idx3 = c.indexOf(anchor3);
if (idx3 === -1) { console.log("FALHOU: anchor3"); ok = false; }
else {
  const novo3 = "const dtNoMesFiltro = (dtStr: string | undefined) => {\r\n" +
"    if (!filtroMesPagto) return true\r\n" +
"    if (filtroMesPagto === '__VAZIO__') return !dtStr\r\n" +
"    if (!dtStr) return false\r\n";
  c = c.slice(0, idx3) + novo3 + c.slice(idx3 + anchor3.length);
  console.log("OK: dtNoMesFiltro trata __VAZIO__");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
