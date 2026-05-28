const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split(
  "label:'Al\\u00EDquota efetiva',value:(emp.aliqEfetiva*100).toFixed(2).replace('.',',')+' %',destaque:true}].map((row:any,i)=>(<div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>{row.label}</span><span style={{fontSize:row.destaque?'15px':'12px',fontWeight:600,color:row.destaque?'#34D399':'#E8EAF0'"
).join(
  "label:'Al\\u00EDquota efetiva',value:(emp.aliqEfetiva*100).toFixed(2).replace('.',',')+' %',destaque:true}].map((row:any,i)=>(<div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>{row.label}</span><span style={{fontSize:row.destaque?'15px':'12px',fontWeight:600,color:row.destaque?emp.cor:'#E8EAF0'"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
