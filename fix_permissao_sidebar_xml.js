const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar import
const a1 = "import { useState, useEffect } from 'react'";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 import"); ok = false; }
else {
  c = c.replace(a1, a1 + "\r\nimport { temPermissao } from '../../utils/permissoes'");
  console.log("OK 1: import de temPermissao adicionado");
}

// 2. Checar permissao no NavItem de Importar XML
const a2 = "{NavItem({ path: \"/xml\", icon: \"📥\", label: \"Importar XML\" })}";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 navitem xml"); ok = false; }
else {
  c = c.replace(a2, "{temPermissao('xml', 'visualizar') && NavItem({ path: \"/xml\", icon: \"📥\", label: \"Importar XML\" })}");
  console.log("OK 2: NavItem Importar XML agora respeita permissao");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
