const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Trocar o campo vale_transporte_valor de number para text sem setas
c = c.replace(
  "{k:'vale_transporte_valor',l:'Valor Total VT (R$/mês)',t:'number'}",
  "{k:'vale_transporte_valor',l:'Valor Total VT (R$/mês)',t:'text'}"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("'vale_transporte_valor',l:'Valor Total VT (R$") ? "OK" : "FALHOU");
