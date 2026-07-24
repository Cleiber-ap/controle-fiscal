const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "<div key={cr.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.3)',borderRadius:8,padding:'8px 12px',marginBottom:8}}>";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "<style>{`@keyframes pulsoCredito { 0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.35) } 50% { box-shadow: 0 0 0 5px rgba(167,139,250,0) } }`}</style>\r\n" +
"                    <div key={cr.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.3)',borderRadius:8,padding:'8px 12px',marginBottom:8,animation:'pulsoCredito 2s ease-in-out infinite'}}>";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - pulso no card de credito fiscal pendente implementado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
