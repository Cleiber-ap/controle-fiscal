const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("const rbt12Cont = (() => {");
const chunk = c.substring(i, i+350);
chunk.split("\r\n").forEach(l => console.log(JSON.stringify(l)));
