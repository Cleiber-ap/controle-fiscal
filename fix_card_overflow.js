const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Adicionar overflow auto no card de Encargos para a tabela nao vazar
c = c.replace(
  "          {/* QUADRO 1 - ENCARGOS */}\n          <div style={{...st.card, borderColor:'#4F8EF744'}}>",
  "          {/* QUADRO 1 - ENCARGOS */}\n          <div style={{...st.card, borderColor:'#4F8EF744', overflowX:'auto'}}>"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("overflowX:'auto'") ? "OK" : "FALHOU");
