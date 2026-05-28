const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Adicionar helper de comparacao de mes na nota
const OLD_HELPER = "  const isVendaOuParcial = (r: any) => {";
const NEW_HELPER = `  const dtNoMesFiltro = (dtStr: string | undefined) => {
    if (!filtroMesPagto || !dtStr) return !filtroMesPagto
    const parts = dtStr.includes('-') ? dtStr.split('-').reverse() : dtStr.split('/')
    const mm = parts[1]?.padStart(2, '0')
    const aa = parts[2]
    return (mm + '/' + aa) === filtroMesPagto
  }

  const isVendaOuParcial = (r: any) => {`;
c = c.replace(OLD_HELPER, NEW_HELPER);

// Filtrar linhas parciais pelo mes filtrado
c = c.replace(
  "{mostrarHistorico && lista.slice(1).map((pg: any, idx: number) => {",
  "{mostrarHistorico && lista.slice(1).filter((pg: any) => !filtroMesPagto || dtNoMesFiltro(pg.dt_pagamento)).map((pg: any, idx: number) => {"
);

// Ocultar linha aguardando quando filtro ativo
c = c.replace(
  "{mostrarProxima && (",
  "{mostrarProxima && !filtroMesPagto && ("
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("dtNoMesFiltro") && c.includes("!filtroMesPagto || dtNoMesFiltro") && c.includes("!filtroMesPagto && (");
console.log(ok ? "OK" : "FALHOU");
