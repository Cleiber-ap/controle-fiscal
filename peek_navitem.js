const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx", "utf8");
const i = c.indexOf("const ativo = location.pathname === path");
console.log(JSON.stringify(c.substring(i, i+1400)));
