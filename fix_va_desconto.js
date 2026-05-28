const fs = require("fs");

// 1. Backend - adicionar campo no modelo
const fb = "C:/projetos/controle-fiscal/backend/app/routers/funcionarios.py";
let cb = fs.readFileSync(fb, "utf8");
cb = cb.replace(
  "    vale_transporte_valor = Column(Float, default=0)",
  "    vale_transporte_valor = Column(Float, default=0)\n    vale_alimentacao_desconto = Column(Float, default=0)"
);
fs.writeFileSync(fb, cb, "utf8");
console.log("1. Backend OK:", cb.includes("vale_alimentacao_desconto"));

// 2. Frontend - calculo
const ff = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let cf = fs.readFileSync(ff, "utf8");

// Adicionar vaDesconto no calcEncargos
cf = cf.replace(
  "  const vtTotal = usaVT ? (parseFloat(func.vale_transporte_valor) || 0) : 0\n  const vtDesconto = usaVT ? Math.min((sal + heValor) * 0.06, vtTotal) : 0\n  const vtValor = vtTotal // custo bruto para empresa",
  "  const vtTotal = usaVT ? (parseFloat(func.vale_transporte_valor) || 0) : 0\n  const vtDesconto = usaVT ? Math.min((sal + heValor) * 0.06, vtTotal) : 0\n  const vtValor = vtTotal\n  const vaDesconto = parseFloat(func.vale_alimentacao_desconto) || 0"
);

// Incluir vaDesconto nos descontos totais
cf = cf.replace(
  "  const totalDescontos = inss + desVT + faltas + vale",
  "  const totalDescontos = inss + desVT + vaDesconto + faltas + vale"
);

// Retornar vaDesconto
cf = cf.replace(
  "return { sal, ferias13, fgts, multaFgts, heValor, heDsr, vtValor, va, dinheiro, inss, desVT, vale, totalEncargos, totalDescontos, salLiquido, totalEmpresa, pctEncargos: totalEncargos / sal }",
  "return { sal, ferias13, fgts, multaFgts, heValor, heDsr, vtValor, va, dinheiro, inss, desVT, vaDesconto, vale, totalEncargos, totalDescontos, salLiquido, totalEmpresa, pctEncargos: totalEncargos / sal }"
);

// Adicionar campo no formulario de funcionario
cf = cf.replace(
  "{k:'vale_transporte_valor',l:'Valor Total VT (R$/mês)',t:'text'}",
  "{k:'vale_transporte_valor',l:'Valor Total VT (R$/mês)',t:'text'},{k:'vale_alimentacao_desconto',l:'Desconto VA funcionário (R$)',t:'text'}"
);

// Adicionar coluna Desc.VA no cabecalho apos Desc.VT
cf = cf.replace(
  "'INSS','Desc. VT','Faltas/Atr.'",
  "'INSS','Desc. VT','Desc. VA','Faltas/Atr.'"
);

// Adicionar celula Desc.VA nas linhas de dados apos desVT
cf = cf.replace(
  "                  <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>",
  "                  <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>\n                  <td style={{...st.td,color:'#F87171'}}>{f.calc.vaDesconto>0?fmtR(f.calc.vaDesconto):'—'}</td>"
);

// Adicionar total Desc.VA no footer
cf = cf.replace(
  "                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>\n                <td style={{...st.td,color:'#F87171'}}>{fmtR(Object.values(faltasAtrasos)",
  "                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>\n                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.vaDesconto,0))}</td>\n                <td style={{...st.td,color:'#F87171'}}>{fmtR(Object.values(faltasAtrasos)"
);

// Atualizar colspan Descontos de 5 para 6
cf = cf.replace(
  '<th colSpan={5} style={{...st.th, background:\'#251A2A\', color:\'#F87171\'',
  '<th colSpan={6} style={{...st.th, background:\'#251A2A\', color:\'#F87171\''
);

fs.writeFileSync(ff, cf, "utf8");
const ok = cf.includes("vaDesconto") && cf.includes("Desc. VA");
console.log("2. Frontend OK:", ok);
