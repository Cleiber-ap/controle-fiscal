const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar leitura do usuario logo apos a funcao logout
const a1 = "function logout() {\r\n      localStorage.removeItem('access_token')\r\n      localStorage.removeItem('usuario')\r\n      navigate('/login')\r\n    }";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 logout"); ok = false; }
else {
  const n1 = a1 + "\r\n    const usuarioLogado = (() => {\r\n      try { return JSON.parse(localStorage.getItem('usuario') || 'null') } catch { return null }\r\n    })()";
  c = c.replace(a1, n1);
  console.log("OK 1: leitura de usuarioLogado adicionada");
}

// 2. Inserir nome antes do botao de sair
const a2 = "<div\r\n              onClick={logout}\r\n              title=\"Sair\"";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 botao sair"); ok = false; }
else {
  const n2 = "{usuarioLogado?.nome && (\r\n              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7B82A0', fontSize: '12px' }}>\r\n                <span style={{ fontSize: '15px' }}>\uD83D\uDC64</span>\r\n                <span style={{ fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{usuarioLogado.nome}</span>\r\n              </div>\r\n            )}\r\n            <div\r\n              onClick={logout}\r\n              title=\"Sair\"";
  c = c.replace(a2, n2);
  console.log("OK 2: nome do usuario inserido antes do botao Sair");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
