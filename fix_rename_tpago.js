const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Renomear comentario
const anchorComment = "// tPago por Mes Lancamento";
if (c.indexOf(anchorComment) === -1) { console.log("FALHOU: anchorComment"); ok = false; }
else c = c.replace(anchorComment, "// tPago por Data de Pagamento (Regime de Caixa)");

// 2. Renomear todas ocorrencias da variavel
const qtdOcorrencias = (c.match(/tPagoMLcto/g) || []).length;
if (qtdOcorrencias === 0) { console.log("FALHOU: nenhuma ocorrencia de tPagoMLcto"); ok = false; }
else {
  c = c.split("tPagoMLcto").join("tPagoPorDtPagamento");
  console.log("Renomeadas " + qtdOcorrencias + " ocorrencias");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - variavel renomeada"); }
else console.log("Corrigir ancoras antes de continuar");
