const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
c = c.replace(
  '        ws[addr].s = { font:{name:"Calibri",sz:11,bold:isSum}, fill:{patternType:"solid",fgColor:{rgb:isSum?"FFFFFF":"000000"}}, border }',
  '        ws[addr].s = { font:{name:"Calibri",sz:11,bold:isSum}, fill:{patternType:"solid",fgColor:{rgb:isSum?"FFFFFF":"000000"}}, border }\n        if(isSum) ws[addr].z = "_(R$* #,##0.00_);_(R$* (#,##0.00);_(R$* \\"-\\"??_);_(@_)"'
);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("if(isSum) ws[addr].z") ? "OK" : "FALHOU");
