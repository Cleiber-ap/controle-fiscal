const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
["setShowStatusMenu(p => !p)", "setShowPagtoMenu(p => !p)", "setShowContbMenu(p => !p)", "setShowEmissaoMenu(p => !p)"].forEach(marker => {
  const i = c.indexOf(marker);
  console.log("=== " + marker + " ===");
  console.log(JSON.stringify(c.substring(i-30, i+300)));
});
