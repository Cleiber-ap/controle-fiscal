const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Corrigir abertura: envolver em fragment em vez de abrir direto no <tr>
c = c.replace(
  "{linhaOriginalNoFiltro && <tr style={rowStyle}>",
  "{linhaOriginalNoFiltro && (<>\n                      <tr style={rowStyle}>"
);

// 2. Remover o } solto antes das linhas parciais e fechar o fragment corretamente
c = c.replace(
  "                      }\n                      {/* LINHAS PAGAMENTOS PARCIAIS",
  "                      </>)}\n                      {/* LINHAS PAGAMENTOS PARCIAIS"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("linhaOriginalNoFiltro && (<>") && c.includes("</>)}") && !c.includes("\n                      }\n                      {/* LINHAS");
console.log(ok ? "OK" : "FALHOU");
