const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Substituir thead com uma linha de grupos + linha de colunas
const OLD_THEAD = `          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Funcionário','Cargo','Salário','Férias+13°','FGTS','Multa 40%','V.Transp.','H.E. (h)','% H.E.','H.Extras','DSR','Total Enc.','% Enc.','Custo Total'].map(h => <th key={h} style={st.th}>{h}</th>)}</tr>
            </thead>`;

const NEW_THEAD = `          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th colSpan={3} style={{...st.th, borderBottom:'none'}} />
                <th colSpan={7} style={{...st.th, background:'#1A2535', color:'#4F8EF7', textAlign:'center', borderBottom:'1px solid #4F8EF7', borderRadius:'4px 4px 0 0'}}>📊 Encargos</th>
                <th colSpan={2} style={{...st.th, background:'#1A2535', color:'#FBBF24', textAlign:'center', borderBottom:'1px solid #FBBF24', borderRadius:'4px 4px 0 0'}}>💰 Totais</th>
                <th colSpan={3} style={{...st.th, background:'#251A2A', color:'#F87171', textAlign:'center', borderBottom:'1px solid #F87171', borderRadius:'4px 4px 0 0'}}>🔻 Descontos</th>
                <th colSpan={1} style={{...st.th, borderBottom:'none'}} />
              </tr>
              <tr>{['Funcionário','Cargo','Salário','Férias+13°','FGTS','Multa 40%','V.Transp.','H.E.(h)','%HE','H.Extras','DSR','Total Enc.','% Enc.','INSS','Desc. VT','Total Desc.','Custo Total'].map(h => <th key={h} style={st.th}>{h}</th>)}</tr>
            </thead>`;

c = c.replace(OLD_THEAD, NEW_THEAD);

// Adicionar colunas INSS, Desc.VT, Total Desc nas linhas de dados (antes de Custo Total)
c = c.replace(
  "                  <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(f.calc.totalEmpresa)}</td>",
  "                  <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.inss)}</td>\n                  <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>\n                  <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(f.calc.totalDescontos)}</td>\n                  <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(f.calc.totalEmpresa)}</td>"
);

// Adicionar totais para INSS, Desc.VT, Total Desc no footer
c = c.replace(
  "                <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(totalGeral)}</td>",
  "                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.inss,0))}</td>\n                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>\n                <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.totalDescontos,0))}</td>\n                <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(totalGeral)}</td>"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("📊 Encargos") && c.includes("🔻 Descontos") && c.includes("f.calc.inss");
console.log(ok ? "OK" : "FALHOU");
