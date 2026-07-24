const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Remover o <style> que ficou dentro do map (causou erro)
const anchorRemover = "<style>{`@keyframes pulsoCredito { 0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.35) } 50% { box-shadow: 0 0 0 5px rgba(167,139,250,0) } }`}</style>\r\n                    ";
const idxRemover = c.indexOf(anchorRemover);
if (idxRemover === -1) { console.log("FALHOU: anchorRemover"); ok = false; }
else {
  c = c.slice(0, idxRemover) + c.slice(idxRemover + anchorRemover.length);
  console.log("OK: style removido de dentro do map");
}

// 2. Inserir o <style> antes do .filter(...).map(...)
const anchor2 = "{(e.key==='six'?creditosSix:creditosEnova).filter((cr:any)=>cr.status==='pendente').map((cr:any)=>(";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "<style>{`@keyframes pulsoCredito { 0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.35) } 50% { box-shadow: 0 0 0 5px rgba(167,139,250,0) } }`}</style>\r\n                  {(e.key==='six'?creditosSix:creditosEnova).filter((cr:any)=>cr.status==='pendente').map((cr:any)=>(";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK: style inserido antes do map");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
