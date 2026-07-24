const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx", "utf8");
const i = c.indexOf("<img src={ENOVA_LOGO}");
console.log(JSON.stringify(c.substring(i-40, i+150)));
