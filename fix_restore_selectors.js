const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /(<h2 style=\{\{ fontSize: 20, fontWeight: 700, margin: 0 \}\}>[^<]*<\/h2>)/,
  "$1\n        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>\n          <select value={mesRef.mes} onChange={e => setMesRef(p => ({ ...p, mes: +e.target.value }))} style={{ ...st.input, width: 140 }}>\n            {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}\n          </select>\n          <input type=\"number\" value={mesRef.ano} onChange={e => setMesRef(p => ({ ...p, ano: +e.target.value }))} style={{ ...st.input, width: 80 }} />\n          <span style={{ fontSize: 12, color: '#7B82A0' }}>Dias \u00FAteis:</span>\n          <input type=\"number\" value={diasUteis} onChange={e => setDiasUteis(+e.target.value)} style={{ ...st.input, width: 60 }} />\n        </div>"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
