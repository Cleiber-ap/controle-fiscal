const fs = require("fs");
const f = "C:/projetos/controle-fiscal/backend/app/routers/funcionarios.py";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "    salario_dinheiro = Column(Float, default=0)",
  "    salario_dinheiro = Column(Float, default=0)\n    vale_transporte_valor = Column(Float, default=0)"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("vale_transporte_valor") ? "OK" : "FALHOU");
