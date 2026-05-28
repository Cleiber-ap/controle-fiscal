const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar V.Alim. no cabecalho apos V.Transp.
c = c.replace(
  "'V.Transp.','H.E.(h)'",
  "'V.Transp.','V.Alim.','H.E.(h)'"
);

// 2. Adicionar celula V.Alim. nas linhas apos vtValor
c = c.replace(
  "                  <td style={{...st.td,padding:'6px 8px'}}>\n                    <input type=\"number\"",
  "                  <td style={st.td}>{fmtR(f.calc.va)}</td>\n                  <td style={{...st.td,padding:'6px 8px'}}>\n                    <input type=\"number\""
);

// 3. Adicionar total V.Alim. no footer
c = c.replace(
  "                <td style={st.td}>—</td>\n                <td style={st.td}>—</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>",
  "                <td style={st.td}>—</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.va,0))}</td>\n                <td style={st.td}>—</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>"
);

// 4. Atualizar colspan Encargos de 7 para 8
c = c.replace(
  '<th colSpan={7} style={{...st.th, background:\'#1A2535\'',
  '<th colSpan={8} style={{...st.th, background:\'#1A2535\''
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("'V.Transp.','V.Alim.'") && c.includes("f.calc.va");
console.log(ok ? "OK" : "FALHOU");
