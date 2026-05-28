const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Compactar td e th do quadro encargos
c = c.replace(
  "    td: { fontSize: 12, color: '#E8EAF0', padding: '9px 12px', borderBottom: '1px solid #1A1D2A', fontFamily: 'monospace' },",
  "    td: { fontSize: 11, color: '#E8EAF0', padding: '6px 8px', borderBottom: '1px solid #1A1D2A', fontFamily: 'monospace' },"
);
c = c.replace(
  "    th: { fontSize: 11, fontWeight: 600, color: '#7B82A0', textTransform: 'uppercase' as any, padding: '8px 12px', textAlign: 'left' as any, borderBottom: '1px solid #252836' },",
  "    th: { fontSize: 10, fontWeight: 600, color: '#7B82A0', textTransform: 'uppercase' as any, padding: '5px 7px', textAlign: 'left' as any, borderBottom: '1px solid #252836' },"
);

// Remover coluna Cargo da tabela de Encargos (poupar espaco)
// Encurtar colunas com valores para texto mais curto
c = c.replace(
  "['Funcionário','Cargo','Salário','Férias+13°','FGTS','Multa 40%','V.Transp.','V.Alim.','Sal.Din.','H.E.(h)','%HE','H.Extras','DSR','Total Enc.','% Enc.','Custo Total']",
  "['Funcionário','Salário','Fér+13°','FGTS','Multa40%','VT','VA','Sal.Din','HE(h)','%HE','H.Ext','DSR','Total Enc','%Enc','Custo']"
);

// Remover celula Cargo nas linhas
c = c.replace(
  "                    <td style={st.td}><b>{f.nome.split(' ').slice(0,2).join(' ')}</b></td>\n                    <td style={{...st.td,color:'#7B82A0',fontSize:11}}>{f.cargo}</td>\n                    <td style={st.td}>{fmtR(f.calc.sal)}</td>",
  "                    <td style={st.td}><b>{f.nome.split(' ')[0]}</b></td>\n                    <td style={st.td}>{fmtR(f.calc.sal)}</td>"
);

// Remover celula Cargo no footer
c = c.replace(
  "                  <td style={{...st.td,fontWeight:700}} colSpan={2}>TOTAL</td>\n                  <td style={st.td}>{fmtR(totalSalarios)}</td>",
  "                  <td style={{...st.td,fontWeight:700}}>TOTAL</td>\n                  <td style={st.td}>{fmtR(totalSalarios)}</td>"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("'Fér+13°'") ? "OK" : "FALHOU");
