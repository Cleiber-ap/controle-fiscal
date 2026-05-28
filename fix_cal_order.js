const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Corrigir: o useEffect com cal deve vir APOS as declaracoes useState
// Remover o useEffect errado
c = c.replace(
  `  useEffect(() => {
    carregar()
    const cal = calcCalendario(mesRef.mes, mesRef.ano)
    setDiasUteis(cal.diasUteis)
    setDomingosFeriados(cal.domingosFeriados)
    setDiasSegSab(cal.diasSegSab)
    setDiasVT(cal.diasVT)
  }, [mesRef])`,
  "  useEffect(() => { carregar() }, [mesRef])"
);

// Adicionar novo useEffect APOS todas as declaracoes de estado (apos faltasAtrasos)
c = c.replace(
  "  useEffect(() => { carregar() }, [mesRef])",
  `  useEffect(() => {
    carregar()
    const cal = calcCalendario(mesRef.mes, mesRef.ano)
    setDiasUteis(cal.diasUteis)
    setDomingosFeriados(cal.domingosFeriados)
    setDiasSegSab(cal.diasSegSab)
    setDiasVT(cal.diasVT)
  }, [mesRef])`
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("cal.diasUteis") ? "OK" : "FALHOU");
