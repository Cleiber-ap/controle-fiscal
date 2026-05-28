const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

const antigo =
  "<select value={mesRef.mes} onChange={e => setMesRef(p => ({ ...p, mes: +e.target.value }))} style={{ ...st.input, width: 140 }}>\n            {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}\n          </select>\n          <input type=\"number\" value={mesRef.ano} onChange={e => setMesRef(p => ({ ...p, ano: +e.target.value }))} style={{ ...st.input, width: 80 }} />\n          <span style={{ fontSize: 12, color: '#7B82A0' }}>Dias \u00FAteis:</span>\n          <input type=\"number\" value={diasUteis} onChange={e => setDiasUteis(+e.target.value)} style={{ ...st.input, width: 60 }} />";

const novo =
  "<span style={{ fontSize: 13, color: '#E8EAF0', fontWeight: 600 }}>{MESES[mesRef.mes - 1]} {mesRef.ano}</span>\n          <span style={{ fontSize: 12, color: '#7B82A0', marginLeft: 8 }}>Dias \u00FAteis: <b style={{ color: '#E8EAF0' }}>{diasUteis}</b></span>";

c = c.split(antigo).join(novo);

fs.writeFileSync(p, c, 'utf8');
console.log('OK - split count:', c.includes('MESES[mesRef.mes - 1]') ? 1 : 0);
