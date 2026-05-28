const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Nomes das abas: SIX e ENOVA
c = c.replace(
  "XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.six,\"SIX COMERCIAL ARTIGOS PROMOCIONAIS\"), \"SIX Comercial\")",
  "XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.six,\"SIX COMERCIAL ARTIGOS PROMOCIONAIS\"), \"SIX\")"
);
c = c.replace(
  "XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.enova,\"ENOVA COMERCIAL ARTIGOS PROMOCIONAIS\"), \"ENOVA Comercial\")",
  "XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.enova,\"ENOVA COMERCIAL ARTIGOS PROMOCIONAIS\"), \"ENOVA\")"
);

// 2. wsName interno tambem
c = c.replace(
  "const wsName = emp.includes(\"SIX\") ? \"SIX Comercial\" : \"ENOVA Comercial\"",
  "const wsName = emp.includes(\"SIX\") ? \"SIX\" : \"ENOVA\""
);

// 3. Formato contabil nas colunas E (ci===4) e G (ci===6)
c = c.replace(
  "          if(isDate) ws[addr].z = \"dd/mm/yyyy\"",
  "          if(isDate) ws[addr].z = \"dd/mm/yyyy\"\n          if(ci===4||ci===6) ws[addr].z = \"_(* #,##0.00_);_(* (#,##0.00);_(* \\\"-\\\"??_);_(@_)\""
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes('"SIX")') && c.includes('"ENOVA")') && c.includes('#,##0.00');
console.log(ok ? "OK" : "FALHOU");
