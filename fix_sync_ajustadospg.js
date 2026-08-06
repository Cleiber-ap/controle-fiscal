const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const [ajustadosPg, setAjustadosPg] = useState<Record<number,boolean>>({})";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = anchor + "\r\n" +
"  useEffect(() => {\r\n" +
"    const upd: Record<number, boolean> = {}\r\n" +
"    notas.forEach((n: any) => {\r\n" +
"      if (n.ajustado) {\r\n" +
"        const lista = pagamentos[n.numero_nf] || []\r\n" +
"        lista.forEach((p: any) => { upd[p.id] = true })\r\n" +
"      }\r\n" +
"    })\r\n" +
"    setAjustadosPg(upd)\r\n" +
"  }, [notas, pagamentos])";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - ajustadosPg agora sincroniza com nota.ajustado ao carregar dados");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
