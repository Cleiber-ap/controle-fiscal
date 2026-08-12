const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar nfsCanReal logo apos nfsCan
const a1 = "const nfsCan = new Set([...lista.filter((n:any)=>n.numero_nf?.endsWith(\"-CAN\")).map((n:any)=>n.numero_nf.replace(\"-CAN\",\"\")), ...ajustesEmp.filter((aj:any)=>aj.nf_referenciada).map((aj:any)=>aj.nf_referenciada)])";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 nfsCan"); ok = false; }
else {
  const n1 = a1 + "\r\n      const nfsCanReal = new Set(lista.filter((n:any)=>n.numero_nf?.endsWith(\"-CAN\")).map((n:any)=>n.numero_nf.replace(\"-CAN\",\"\")))";
  c = c.replace(a1, n1);
  console.log("OK 1: nfsCanReal adicionado");
}

// 2. Trocar as 2 ocorrencias do sufixo
const antes = (c.match(/\(nfsCan\.has\(n\.numero_nf\)\?"\/Cancelada":""\)/g) || []).length;
if (antes === 0) { console.log("FALHOU: 2 sufixo (nenhuma ocorrencia)"); ok = false; }
else {
  c = c.split('(nfsCan.has(n.numero_nf)?"/Cancelada":"")').join('(nfsCan.has(n.numero_nf)?(nfsCanReal.has(n.numero_nf)?"/Cancelada":"/Entrada"):"")');
  console.log("OK 2: sufixo diferenciado nas " + antes + " ocorrencias");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
