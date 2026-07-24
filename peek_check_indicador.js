const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx", "utf8");
console.log("Ocorrencias do indicador:", (c.match(/translateY\(-50%\)/g) || []).length);
const i = c.indexOf("translateY(-50%)");
console.log(JSON.stringify(c.substring(i-100, i+250)));
