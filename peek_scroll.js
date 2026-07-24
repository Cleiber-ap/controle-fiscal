const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("alvo.scrollIntoView");
console.log(JSON.stringify(c.substring(i-30, i+350)));
