const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "<div\r\n              onClick={logout}\r\n              title=\"Sair\"";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "{usuarioLogado?.nome && (\r\n              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7B82A0', fontSize: '12px' }}>\r\n                <span style={{ fontSize: '15px' }}>\uD83D\uDC64</span>\r\n                <span style={{ fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{usuarioLogado.nome}</span>\r\n              </div>\r\n            )}\r\n            <div\r\n              onClick={logout}\r\n              title=\"Sair\"";
  c = c.replace(anchor, novo);
  console.log("OK - nome do usuario inserido antes do botao Sair");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancora antes de continuar");
