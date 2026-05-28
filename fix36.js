const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Reverter fix35 - voltar para new Date local (sem UTC)
c = c.replace(
  "      const d = new Date(Date.UTC(+parts[2], +parts[1] - 1, +parts[0]))",
  "      const d = new Date(+parts[2], +parts[1] - 1, +parts[0], 12, 0, 0)"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("12, 0, 0)") ? "OK" : "FALHOU");
