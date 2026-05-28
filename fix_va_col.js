const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Atualizar colspan Encargos de 7 para 8
c = c.replace(
  '<th colSpan={7} style={{...st.th, background:\'#1A2535\', color:\'#4F8EF7\', textAlign:\'center\', borderBottom:\'1px solid #4F8EF7\', borderRadius:\'4px 4px 0 0\'}}>📊 Encargos</th>',
  '<th colSpan={8} style={{...st.th, background:\'#1A2535\', color:\'#4F8EF7\', textAlign:\'center\', borderBottom:\'1px solid #4F8EF7\', borderRadius:\'4px 4px 0 0\'}}>📊 Encargos</th>'
);

// 2. Adicionar V.Alim. no cabecalho apos V.Transp.
c = c.replace(
  "'V.Transp.','H.E.(h)'",
  "'V.Transp.','V.Alim.','H.E.(h)'"
);

// 3. Adicionar celula V.Alim. nas linhas de dados apos vtValor
c = c.replace(
  "                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>",
  "                  <td style={st.td}>{fmtR(f.calc.va)}</td>\n                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>"
);

// 4. Adicionar total V.Alim. no footer apos vtValor
c = c.replace(
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>",
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.va,0))}</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("'V.Alim.'") && c.includes("f.calc.va");
console.log(ok ? "OK" : "FALHOU");
