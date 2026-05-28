const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Adicionar flag dtLinhaOriginal logo apos a linha do mostrarProxima
const OLD = "                  const isCancelada = r.numero_nf?.endsWith('-CAN')";
const NEW = `                  // Data exibida na linha original para comparar com filtro
                  const dtLinhaOriginal = temHistorico ? (lista[0]?.dt_pagamento || '') : (r.dt_pagamento || r.data_pagamento || '')
                  const linhaOriginalNoFiltro = !filtroMesPagto || dtNoMesFiltro(dtLinhaOriginal)

                  const isCancelada = r.numero_nf?.endsWith('-CAN')`;
c = c.replace(OLD, NEW);

// Envolver linha original em condicional
c = c.replace(
  "                      {/* LINHA ORIGINAL */}\n                      <tr style={rowStyle}>",
  "                      {/* LINHA ORIGINAL */}\n                      {linhaOriginalNoFiltro && <tr style={rowStyle}>"
);

// Fechar o condicional da linha original — fechar antes das linhas parciais
// A linha original termina antes do bloco de edicao. Precisamos achar o fim do <tr> original
c = c.replace(
  "                      {/* LINHAS PAGAMENTOS PARCIAIS",
  "                      }\n                      {/* LINHAS PAGAMENTOS PARCIAIS"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("linhaOriginalNoFiltro") && c.includes("dtLinhaOriginal");
console.log(ok ? "OK" : "FALHOU - verificar manualmente");
