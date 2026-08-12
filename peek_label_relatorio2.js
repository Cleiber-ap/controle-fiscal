const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx", "utf8");
const marker = "Cancelada";
let idx = 0, count = 0;
while (true) {
  const found = c.indexOf(marker, idx);
  if (found === -1) break;
  count++;
  console.log(JSON.stringify(c.substring(found-80, found+30)));
  idx = found + marker.length;
}
console.log("Total:", count);
