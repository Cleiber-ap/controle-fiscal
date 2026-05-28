const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/App.tsx";
let c = fs.readFileSync(f, "utf8");
c = c.replace(
  '<Route path="/configuracoes" element={<Configuracoes />} />',
  '<Route path="/configuracoes" element={<Layout><Configuracoes /></Layout>} />'
);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("<Layout><Configuracoes") ? "OK" : "FALHOU");
