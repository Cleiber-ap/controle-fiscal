const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "{[...new Set(ultimos4.flatMap((r:any)=>{",
  "{[...new Set(notas.flatMap((r:any)=>{"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("notas.flatMap") ? "OK" : "FALHOU");
