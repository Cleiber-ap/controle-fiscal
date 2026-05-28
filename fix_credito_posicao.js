const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// Mover bloco de creditos pendentes para ANTES do e.conf ? ... : ...
const blocoCredito =
  "                  {(e.key==='six'?creditosSix:creditosEnova).filter((cr:any)=>cr.status==='pendente').map((cr:any)=>(\n" +
  "                    <div key={cr.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.3)',borderRadius:8,padding:'8px 12px',marginBottom:8}}>\n" +
  "                      <div style={{fontSize:11,color:'#A78BFA'}}>\n" +
  "                        \uD83D\uDFE2 Cr\u00e9dito Fiscal \u2014 NF {cr.nf_referenciada} \u00b7 R$ {(cr.valor_nf_original*(e.key==='six'?aliqEfetivaSix:aliqEfetivaEnova)).toLocaleString('pt-BR',{minimumFractionDigits:2})}\n" +
  "                      </div>\n" +
  "                      <button onClick={async()=>{\n" +
  "                        await fetch('http://localhost:8000/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'autorizado'})})\n" +
  "                        window.location.reload()\n" +
  "                      }} style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>\n" +
  "                        Autorizar\n" +
  "                      </button>\n" +
  "                    </div>\n" +
  "                  ))}\n";

// Remover bloco de dentro do condicional
c = c.split(blocoCredito).join('');

// Inserir antes do e.conf ?
c = c.split(
  "              {e.conf ? ("
).join(
  blocoCredito + "              {e.conf ? ("
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
