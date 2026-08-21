const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "<div\r\n              onClick={logout}\r\n              title=\"Sair\"\r\n              style={{ cursor: 'pointer', color: '#7B82A0', padding: '4px', fontSize: '16px' }}\r\n              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.color = '#F87171'}\r\n              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.color = '#7B82A0'}\r\n            ></div>";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "<div\r\n              onClick={logout}\r\n              title=\"Sair\"\r\n              style={{ cursor: 'pointer', color: '#7B82A0', padding: '4px 8px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px', transition: 'color 0.15s' }}\r\n              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.color = '#F87171'}\r\n              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.color = '#7B82A0'}\r\n            >\u23FB</div>";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - icone de sair adicionado (botao ja existia, so estava vazio)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
