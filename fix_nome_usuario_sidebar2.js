const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "function logout() {\r\n    localStorage.removeItem('access_token')\r\n    localStorage.removeItem('usuario')\r\n    navigate('/login')\r\n  }";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = anchor + "\r\n  const usuarioLogado = (() => {\r\n    try { return JSON.parse(localStorage.getItem('usuario') || 'null') } catch { return null }\r\n  })()";
  c = c.replace(anchor, novo);
  console.log("OK - leitura de usuarioLogado adicionada");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancora antes de continuar");
