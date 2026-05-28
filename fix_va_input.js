const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");
c = c.replace(
  "{k:'vale_alimentacao',l:'Vale Alimentação (R$)',t:'number'}",
  "{k:'vale_alimentacao',l:'Vale Alimentação (R$)',t:'text'}"
);
fs.writeFileSync(f, c, "utf8");
console.log("OK");
