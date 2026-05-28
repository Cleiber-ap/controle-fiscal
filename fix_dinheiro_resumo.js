const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar Sal.Din. no cabecalho apos V.Alim.
c = c.replace(
  "'V.Transp.','V.Alim.','H.E.(h)'",
  "'V.Transp.','V.Alim.','Sal.Din.','H.E.(h)'"
);

// 2. Adicionar celula Sal.Din. nas linhas apos va
c = c.replace(
  "                  <td style={st.td}>{fmtR(f.calc.va)}</td>\n                  <td style={{...st.td,padding:'6px 8px'}}>\n                    <input type=\"number\"",
  "                  <td style={st.td}>{fmtR(f.calc.va)}</td>\n                  <td style={st.td}>{f.calc.dinheiro > 0 ? fmtR(f.calc.dinheiro) : '—'}</td>\n                  <td style={{...st.td,padding:'6px 8px'}}>\n                    <input type=\"number\""
);

// 3. Adicionar total Sal.Din. no footer
c = c.replace(
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.va,0))}</td>\n                <td style={st.td}>—</td>\n                <td style={st.td}>—</td>",
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.va,0))}</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.dinheiro,0))}</td>\n                <td style={st.td}>—</td>\n                <td style={st.td}>—</td>"
);

// 4. Atualizar colspan Encargos de 8 para 9
c = c.replace(
  '<th colSpan={8} style={{...st.th, background:\'#1A2535\'',
  '<th colSpan={9} style={{...st.th, background:\'#1A2535\''
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("'Sal.Din.'") && c.includes("f.calc.dinheiro");
console.log(ok ? "OK" : "FALHOU");
