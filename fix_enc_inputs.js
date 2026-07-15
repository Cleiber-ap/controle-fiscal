const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx', 'utf8');

// Input HE(h) - adicionar disabled
const heOld = 'onChange={e=>salvarHoras(f.id,+e.target.value)} style={{...st.input,width:55';
const heNew = "onChange={e=>temPermissao('encargos','editar')&&salvarHoras(f.id,+e.target.value)} disabled={!temPermissao('encargos','editar')} style={{...st.input,width:55";
if (!c.includes(heOld)) { console.log('NAO ENCONTRADO: HE input'); process.exit(1); }
c = c.replace(heOld, heNew);

// Select %HE - adicionar disabled
const pctOld = "onChange={e=>setPctHE(p=>({...p,[f.id]:+e.target.value}))} style={{...st.input,width:70";
const pctNew = "onChange={e=>temPermissao('encargos','editar')&&setPctHE(p=>({...p,[f.id]:+e.target.value}))} disabled={!temPermissao('encargos','editar')} style={{...st.input,width:70";
if (!c.includes(pctOld)) { console.log('NAO ENCONTRADO: pctHE select'); process.exit(1); }
c = c.replace(pctOld, pctNew);

// Input Faltas/Atr - adicionar disabled
const faltasOld = "onChange={e=>setFaltasAtrasos(p=>({...p,[f.id]:parseFloat(e.target.value.replace(\",\",\".\"))||0}))}";
const faltasNew = "onChange={e=>temPermissao('encargos','editar')&&setFaltasAtrasos(p=>({...p,[f.id]:parseFloat(e.target.value.replace(\",\",\".\"))||0}))} disabled={!temPermissao('encargos','editar')}";
if (!c.includes(faltasOld)) { console.log('NAO ENCONTRADO: faltas input'); process.exit(1); }
c = c.replace(faltasOld, faltasNew);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx', c, 'utf8');
console.log('OK');
