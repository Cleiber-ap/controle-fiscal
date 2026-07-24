const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "return (\r\n      <div\r\n        onClick={() => navigate(path)}\r\n        style={{\r\n          display: 'flex', alignItems: 'center', gap: '9px',\r\n          padding: '8px 10px', borderRadius: '6px', cursor: 'pointer',\r\n          color: ativo ? corAtivo : '#7B82A0',\r\n          background: ativo ? bgAtivo : 'transparent',\r\n          fontSize: '13px', fontWeight: 500,\r\n          transition: 'all .15s', marginBottom: '2px',\r\n        }}\r\n        onMouseEnter={e => { if (!ativo) { const el = e.currentTarget as HTMLDivElement; el.style.background = '#1A1D2A'; el.style.color = '#E8EAF0' } }}\r\n        onMouseLeave={e => { if (!ativo) { const el = e.currentTarget as HTMLDivElement; el.style.background = 'transparent'; el.style.color = '#7B82A0' } }}\r\n      >\r\n        <span style={{ fontSize: '14px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "return (\r\n      <div\r\n        onClick={() => navigate(path)}\r\n        style={{\r\n          display: 'flex', alignItems: 'center', gap: '9px', position: 'relative',\r\n          padding: '8px 10px', borderRadius: '6px', cursor: 'pointer',\r\n          color: ativo ? corAtivo : '#7B82A0',\r\n          background: ativo ? bgAtivo : 'transparent',\r\n          fontSize: '13px', fontWeight: 500,\r\n          transition: 'all .15s', marginBottom: '2px',\r\n        }}\r\n        onMouseEnter={e => { if (!ativo) { const el = e.currentTarget as HTMLDivElement; el.style.background = '#1A1D2A'; el.style.color = '#E8EAF0' } }}\r\n        onMouseLeave={e => { if (!ativo) { const el = e.currentTarget as HTMLDivElement; el.style.background = 'transparent'; el.style.color = '#7B82A0' } }}\r\n      >\r\n        <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: ativo ? '3px' : '0px', height: '60%', borderRadius: '0 3px 3px 0', background: corAtivo, transition: 'width 0.25s ease' }} />\r\n        <span style={{ fontSize: '14px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - indicador deslizante da sidebar implementado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
