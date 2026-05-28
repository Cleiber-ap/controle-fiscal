const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// Substituir as duas listas separadas por uma lista combinada e ordenada
const listaAntiga =
  "              {feriadosFixosMes.map((f:any,i:number)=>(\n" +
  "                <div key={'fx'+i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#0E101780',borderRadius:6,padding:'8px 12px',border:'1px solid #2A2D3E88',opacity:0.85}}>\n" +
  "                  <div style={{display:'flex',alignItems:'center',gap:10}}>\n" +
  "                    <span style={{fontSize:14}}>{f.tipo==='nacional'?'\uD83C\uDDE7\uD83C\uDDF7':'\uD83C\uDFDB\uFE0F'}</span>\n" +
  "                    <div>\n" +
  "                      <div style={{fontSize:13,fontWeight:600,color:'#A0A8C0'}}>{f.descricao}</div>\n" +
  "                      <div style={{fontSize:11,color:'#5A6080'}}>{String(f.dia).padStart(2,'0')}/{String(f.mes).padStart(2,'0')} \u00B7 <span style={{color:'#5A6080'}}>{f.tipo} \u00B7 fixo autom\u00E1tico</span></div>\n" +
  "                    </div>\n" +
  "                  </div>\n" +
  "                  <span style={{fontSize:10,color:'#5A6080',border:'1px solid #2A2D3E',borderRadius:4,padding:'2px 6px'}}>\uD83D\uDD12 fixo</span>\n" +
  "                </div>\n" +
  "              ))}\n" +
  "              {feriadosCustom.length===0 && feriadosFixosMes.length===0 && <div style={{textAlign:'center',color:'#7B82A0',fontSize:13,padding:'16px 0'}}>Nenhum feriado neste m\u00EAs.</div>}\n" +
  "{[...feriadosCustom].sort((a:any,b:any)=> a.mes !== b.mes ? a.mes - b.mes : a.dia - b.dia).map((f:any)=>(\n";

const listaNova =
  "              {[...feriadosFixosMes.map((f:any)=>({...f,fixo:true})),...feriadosCustom.map((f:any)=>({...f,fixo:false}))]\n" +
  "                .sort((a:any,b:any)=> a.mes !== b.mes ? a.mes - b.mes : a.dia - b.dia)\n" +
  "                .map((f:any,i:number)=> f.fixo ? (\n" +
  "                <div key={'fx'+i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#0E101780',borderRadius:6,padding:'8px 12px',border:'1px solid #2A2D3E88',opacity:0.85}}>\n" +
  "                  <div style={{display:'flex',alignItems:'center',gap:10}}>\n" +
  "                    <span style={{fontSize:14}}>{f.tipo==='nacional'?'\uD83C\uDDE7\uD83C\uDDF7':'\uD83C\uDFDB\uFE0F'}</span>\n" +
  "                    <div>\n" +
  "                      <div style={{fontSize:13,fontWeight:600,color:'#A0A8C0'}}>{f.descricao}</div>\n" +
  "                      <div style={{fontSize:11,color:'#5A6080'}}>{String(f.dia).padStart(2,'0')}/{String(f.mes).padStart(2,'0')} \u00B7 <span style={{color:'#5A6080'}}>{f.tipo} \u00B7 fixo autom\u00E1tico</span></div>\n" +
  "                    </div>\n" +
  "                  </div>\n" +
  "                  <span style={{fontSize:10,color:'#5A6080',border:'1px solid #2A2D3E',borderRadius:4,padding:'2px 6px'}}>\uD83D\uDD12 fixo</span>\n" +
  "                </div>\n" +
  "              ) : (\n";

c = c.split(listaAntiga).join(listaNova);

// Ajustar fechamento da lista combinada (adicionar fechamento do ternario)
c = c.split(
  "              </div>\n" +
  "            )}\n" +
  "          </div>"
).join(
  "              </div>\n" +
  "              ))}\n" +
  "              {feriadosCustom.length===0 && feriadosFixosMes.length===0 && <div style={{textAlign:'center',color:'#7B82A0',fontSize:13,padding:'16px 0'}}>Nenhum feriado neste m\u00EAs.</div>}\n" +
  "            </div>\n" +
  "          </div>"
);

fs.writeFileSync(p, c, 'utf8');
const ok = c.includes('feriadosFixosMes.map((f:any)=>({...f,fixo:true}))');
console.log(ok ? 'OK' : 'FALHOU');
