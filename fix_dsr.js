const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar coluna DSR no cabecalho
c = c.replace(
  "['Funcionário','Cargo','Salário','Férias+13°','FGTS','Multa 40%','V.Transp.','H.Extras','Total Enc.','% Enc.','Custo Total','H.E. (h)']",
  "['Funcionário','Cargo','Salário','Férias+13°','FGTS','Multa 40%','V.Transp.','H.Extras','DSR','Total Enc.','% Enc.','Custo Total','H.E. (h)']"
);

// 2. Adicionar célula DSR nas linhas de dados (após heValor)
c = c.replace(
  "                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>",
  "                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>\n                  <td style={st.td}>{f.calc.heDsr > 0 ? fmtR(f.calc.heDsr) : '—'}</td>"
);

// 3. Adicionar célula DSR no total (após heValor total)
c = c.replace(
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>",
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heDsr,0))}</td>"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("'DSR'") && c.includes("f.calc.heDsr") ? "OK" : "FALHOU");
