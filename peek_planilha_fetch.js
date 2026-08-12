const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx", "utf8");
console.log("=== FETCH ===");
let i = c.indexOf("const [notasSix, notasEnova] = await Promise.all");
console.log(JSON.stringify(c.substring(i, i+400)));
console.log("=== PUSH ===");
i = c.indexOf("resultado.push({");
console.log(JSON.stringify(c.substring(i, i+450)));
