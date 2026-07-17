const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");

console.log("=== 1. STATE (filtroTipo) ===");
let i = c.indexOf("const [filtroTipo, setFiltroTipo] = useState('')");
console.log(JSON.stringify(c.substring(i, i+60)));

console.log("=== 2. SELECT PAGAMENTO (fim ate proximo elemento) ===");
i = c.indexOf("<select value={filtroMesPagto}");
console.log(JSON.stringify(c.substring(i, i+900)));

console.log("=== 3. notasFiltradas4 definicao + notasFiltradas4.map ===");
i = c.indexOf("const notasFiltradas4 = filtroStatus.length");
console.log(JSON.stringify(c.substring(i, i+500)));

console.log("=== 4. FOOTER ===");
i = c.indexOf("const tdColSpan4") ;
i = c.indexOf("TOTAIS</td>");
console.log(JSON.stringify(c.substring(i-50, i+900)));
