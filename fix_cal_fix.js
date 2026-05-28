const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Voltar estados para valores fixos (sem calcInicial)
c = c.replace(
  /  const calcInicial = calcCalendario\([^)]+\)\n  const \[diasUteis, setDiasUteis\] = useState\(calcInicial\.diasUteis\)\n  const \[domingosFeriados, setDomingosFeriados\] = useState\(calcInicial\.domingosFeriados\)\n  const \[diasSegSab, setDiasSegSab\] = useState\(calcInicial\.diasSegSab\)\n  const \[diasVT, setDiasVT\] = useState\(calcInicial\.diasVT\)/,
  "  const [diasUteis, setDiasUteis] = useState(22)\n  const [domingosFeriados, setDomingosFeriados] = useState(6)\n  const [diasSegSab, setDiasSegSab] = useState(25)\n  const [diasVT, setDiasVT] = useState(20)"
);

fs.writeFileSync(f, c, "utf8");
console.log(!c.includes("calcInicial") ? "OK" : "FALHOU");
