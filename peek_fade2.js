const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("key={empresa}");
const chunk = c.substring(i, i+200);
console.log(JSON.stringify(chunk));
// procurar o fechamento </table>\r\n          </div> depois desse ponto
const j = c.indexOf("</table>", i);
console.log(JSON.stringify(c.substring(j, j+60)));
