const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "      const d = new Date(+parts[2], +parts[1] - 1, +parts[0])",
  "      const d = new Date(Date.UTC(+parts[2], +parts[1] - 1, +parts[0]))"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("Date.UTC(+parts[2]") ? "OK" : "FALHOU");
