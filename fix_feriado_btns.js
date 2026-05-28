const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// Substituir botoes por versao com emojis lado a lado
c = c.split(
  "<button onClick={()=>{setEditandoFeriado(f.id);setFormFeriado({dia:String(f.dia),mes:String(f.mes),descricao:f.descricao,tipo:f.tipo})}} style={{background:'transparent',border:'1px solid #4F8EF744',borderRadius:4,color:'#4F8EF7',padding:'4px 8px',fontSize:11,cursor:'pointer',marginRight:4}}>\u270F\uFE0F</button>" +
  "<button onClick={()=>excluirFeriado(f.id)} style={{background:'transparent',border:'1px solid #F8717144',borderRadius:4,color:'#F87171',padding:'4px 8px',fontSize:11,cursor:'pointer'}}>\u2715</button>"
).join(
  "<div style={{display:'flex',gap:4}}>" +
  "<button onClick={()=>{setEditandoFeriado(f.id);setFormFeriado({dia:String(f.dia),mes:String(f.mes),descricao:f.descricao,tipo:f.tipo})}} style={{background:'transparent',border:'none',padding:'4px',fontSize:15,cursor:'pointer'}}>\u270F\uFE0F</button>" +
  "<button onClick={()=>excluirFeriado(f.id)} style={{background:'transparent',border:'none',padding:'4px',fontSize:15,cursor:'pointer'}}>\uD83D\uDDD1\uFE0F</button>" +
  "</div>"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
