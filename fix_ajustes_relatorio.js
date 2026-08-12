const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Novo state para ajustes
const a1 = "const [pagamentos, setPagamentos] = useState<Record<string, any[]>>({})";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 state"); ok = false; }
else {
  c = c.slice(0, i1) + a1 + "\r\n  const [ajustesSix, setAjustesSix] = useState<any[]>([])\r\n  const [ajustesEnova, setAjustesEnova] = useState<any[]>([])" + c.slice(i1 + a1.length);
  console.log("OK 1: states de ajustes adicionados");
}

// 2. Buscar ajustes junto com o resto (Promise.all principal)
const a2 = "api.get('/notas/1').then(r => r.data).catch(() => []),\r\n      api.get('/notas/2').then(r => r.data).catch(() => []),\r\n    ]).then(([h1, h2, d1, d2, emp, n1, n2]) => {\r\n      setHistSix(h1); setHistEnova(h2)\r\n      setDasSix(d1); setDasEnova(d2)\r\n      setEmpresas(emp)\r\n      setNotas({ six: n1, enova: n2 })";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 promise.all"); ok = false; }
else {
  const n2 = "api.get('/notas/1').then(r => r.data).catch(() => []),\r\n      api.get('/notas/2').then(r => r.data).catch(() => []),\r\n      api.get('/notas/ajustes/1').then((r:any) => r.data).catch(() => []),\r\n      api.get('/notas/ajustes/2').then((r:any) => r.data).catch(() => []),\r\n    ]).then(([h1, h2, d1, d2, emp, n1, n2, aj1, aj2]) => {\r\n      setHistSix(h1); setHistEnova(h2)\r\n      setDasSix(d1); setDasEnova(d2)\r\n      setEmpresas(emp)\r\n      setNotas({ six: n1, enova: n2 })\r\n      setAjustesSix(Array.isArray(aj1) ? aj1 : [])\r\n      setAjustesEnova(Array.isArray(aj2) ? aj2 : [])";
  c = c.slice(0, i2) + n2 + c.slice(i2 + a2.length);
  console.log("OK 2: fetch de ajustes adicionado ao Promise.all");
}

// 3. buildSheet: aceitar ajustesEmp e incluir no nfsCan
const a3 = "const buildSheet = (lista: any[], emp: string) => {";
const i3 = c.indexOf(a3);
if (i3 === -1) { console.log("FALHOU: 3 assinatura buildSheet"); ok = false; }
else {
  c = c.replace(a3, "const buildSheet = (lista: any[], emp: string, ajustesEmp: any[]) => {");
  console.log("OK 3: assinatura de buildSheet atualizada");
}

const a4 = "const nfsCan = new Set(lista.filter((n:any)=>n.numero_nf?.endsWith(\"-CAN\")).map((n:any)=>n.numero_nf.replace(\"-CAN\",\"\")))";
const i4 = c.indexOf(a4);
if (i4 === -1) { console.log("FALHOU: 4 nfsCan"); ok = false; }
else {
  const n4 = "const nfsCan = new Set([...lista.filter((n:any)=>n.numero_nf?.endsWith(\"-CAN\")).map((n:any)=>n.numero_nf.replace(\"-CAN\",\"\")), ...ajustesEmp.filter((aj:any)=>aj.nf_referenciada).map((aj:any)=>aj.nf_referenciada)])";
  c = c.replace(a4, n4);
  console.log("OK 4: nfsCan agora inclui nf_referenciada dos ajustes de devolucao");
}

// 5. Chamadas de buildSheet passando os ajustes certos
const a5 = "XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.six,\"SIX COMERCIAL ARTIGOS PROMOCIONAIS\"), \"SIX\")\r\n    XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.enova,\"ENOVA COMERCIAL ARTIGOS PROMOCIONAIS\"), \"ENOVA\")";
const i5 = c.indexOf(a5);
if (i5 === -1) { console.log("FALHOU: 5 chamadas"); ok = false; }
else {
  const n5 = "XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.six,\"SIX COMERCIAL ARTIGOS PROMOCIONAIS\",ajustesSix), \"SIX\")\r\n    XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.enova,\"ENOVA COMERCIAL ARTIGOS PROMOCIONAIS\",ajustesEnova), \"ENOVA\")";
  c = c.replace(a5, n5);
  console.log("OK 5: chamadas de buildSheet atualizadas");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
