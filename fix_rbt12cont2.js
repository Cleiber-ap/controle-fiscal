const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const rbt12Cont = (() => {\r\n" +
"    let sum = 0\r\n" +
"    for (let i = 0; i < 12; i++) {\r\n" +
"      const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1)\r\n" +
"      const m = d.getMonth() + 1; const a = d.getFullYear()\r\n" +
"      sum += (hist.find((r:any) => r.ano === a && r.mes === m)?.valor || 0)\r\n" +
"    }\r\n" +
"    return sum\r\n" +
"  })()";

const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const rbt12Cont = (() => {\r\n" +
"    let sum = 0\r\n" +
"    for (let i = 1; i < 13; i++) {\r\n" +
"      const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1)\r\n" +
"      const m = d.getMonth() + 1; const a = d.getFullYear()\r\n" +
"      const fat = (hist.find((r:any) => r.ano === a && r.mes === m)?.valor || 0)\r\n" +
"      const dev = ajustes.filter((aj:any) => aj.ano === a && aj.mes === m).reduce((s:number, aj:any) => s + aj.valor, 0)\r\n" +
"      sum += fat - dev\r\n" +
"    }\r\n" +
"    return sum\r\n" +
"  })()";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - rbt12Cont agora identico ao calcRbt12 do Inicio");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
