const fs = require("fs");
const ff = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(ff, "utf8");

// Reverter fix_va_col: remover V.Alim. do cabecalho
c = c.replace("'V.Transp.','V.Alim.','H.E.(h)'", "'V.Transp.','H.E.(h)'");

// Remover celula V.Alim. nas linhas de dados
c = c.replace(
  "                  <td style={st.td}>{fmtR(f.calc.va)}</td>\n                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>",
  "                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>"
);

// Remover total V.Alim. no footer
c = c.replace(
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.va,0))}</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>",
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>"
);

// Reverter colspan Encargos de 8 para 7
c = c.replace(
  '<th colSpan={8} style={{...st.th, background:\'#1A2535\'',
  '<th colSpan={7} style={{...st.th, background:\'#1A2535\''
);

// Reverter fix_va_desconto: remover Desc.VA do cabecalho
c = c.replace("'INSS','Desc. VT','Desc. VA','Faltas/Atr.'", "'INSS','Desc. VT','Faltas/Atr.'");

// Remover celula Desc.VA nas linhas
c = c.replace(
  "                  <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>\n                  <td style={{...st.td,color:'#F87171'}}>{f.calc.vaDesconto>0?fmtR(f.calc.vaDesconto):'—'}</td>",
  "                  <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>"
);

// Remover total Desc.VA no footer
c = c.replace(
  "                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>\n                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.vaDesconto,0))}</td>\n",
  "                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>\n"
);

// Reverter colspan Descontos de 6 para 5
c = c.replace(
  '<th colSpan={6} style={{...st.th, background:\'#251A2A\'',
  '<th colSpan={5} style={{...st.th, background:\'#251A2A\''
);

// Reverter calculo: remover vaDesconto do totalDescontos
c = c.replace(
  "  const totalDescontos = inss + desVT + vaDesconto + faltas + vale",
  "  const totalDescontos = inss + desVT + faltas + vale"
);

// Remover vaDesconto do calculo
c = c.replace(
  "  const vtValor = vtTotal\n  const vaDesconto = parseFloat(func.vale_alimentacao_desconto) || 0",
  "  const vtValor = vtTotal"
);

// Remover vaDesconto do retorno
c = c.replace(
  "return { sal, ferias13, fgts, multaFgts, heValor, heDsr, vtValor, va, dinheiro, inss, desVT, vaDesconto, vale,",
  "return { sal, ferias13, fgts, multaFgts, heValor, heDsr, vtValor, va, dinheiro, inss, desVT, vale,"
);

// Remover campo desconto VA do formulario
c = c.replace(
  ",{k:'vale_alimentacao_desconto',l:'Desconto VA funcionário (R$)',t:'text'}",
  ""
);

fs.writeFileSync(ff, c, "utf8");
const ok = !c.includes("V.Alim.") && !c.includes("vaDesconto") && !c.includes("Desc. VA");
console.log(ok ? "OK" : "FALHOU");
