const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "{temPermissao('inicio', 'editar') && <button onClick={async()=>{\r\n" +
"                        await fetch('https://diligent-integrity-production-3f98.up.railway.app/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'autorizado'})})\r\n" +
"                        window.location.reload()\r\n" +
"                      }} style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>\r\n" +
"                        Autorizar\r\n" +
"                      </button>}";

const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = anchor + "\r\n" +
"                      {temPermissao('inicio', 'editar') && <button onClick={async()=>{\r\n" +
"                        if (!window.confirm('Recusar este credito fiscal? Ele deixara de contar nos calculos.')) return\r\n" +
"                        await fetch('https://diligent-integrity-production-3f98.up.railway.app/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'recusado'})})\r\n" +
"                        window.location.reload()\r\n" +
"                      }} style={{marginLeft:6,padding:'4px 10px',background:'transparent',border:'1px solid #2A2D3E',borderRadius:6,color:'#7B82A0',fontSize:11,cursor:'pointer'}}>\r\n" +
"                        Recusar\r\n" +
"                      </button>}";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - botao Recusar adicionado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
