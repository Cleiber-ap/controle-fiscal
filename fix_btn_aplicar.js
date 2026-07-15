const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "<button onClick={() => { setFiltroStatus([]); setShowStatusMenu(false) }} style={{ fontSize:'11px', color:'#7B82A0', background:'none', border:'none', cursor:'pointer' }}>Limpar</button>";
const novo = "<button onClick={() => { setFiltroStatus([]); setShowStatusMenu(false) }} style={{ fontSize:'11px', color:'#7B82A0', background:'none', border:'none', cursor:'pointer' }}>Limpar</button><button onClick={() => setShowStatusMenu(false)} style={{ fontSize:'11px', color:'#34D399', background:'none', border:'none', cursor:'pointer', marginLeft:8 }}>Aplicar</button>";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
