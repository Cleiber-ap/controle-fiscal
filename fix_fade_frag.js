const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Abrir Fragment antes do <style>
const anchor1 = "<style>{`@keyframes fadeInTabela { from { opacity: 0.2 } to { opacity: 1 } }`}</style>\r\n          <div key={empresa} style={{ overflowX: 'auto', animation: 'fadeInTabela 0.35s ease' }}>";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  const novo1 = "<>\r\n          <style>{`@keyframes fadeInTabela { from { opacity: 0.2 } to { opacity: 1 } }`}</style>\r\n          <div key={empresa} style={{ overflowX: 'auto', animation: 'fadeInTabela 0.35s ease' }}>";
  c = c.slice(0, idx1) + novo1 + c.slice(idx1 + anchor1.length);
  console.log("OK: Fragment aberto");
}

// 2. Fechar Fragment depois do </table></div>
const anchor2 = "</table>\r\n          </div>\r\n        )}\r\n      </div>\r\n    </";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "</table>\r\n          </div>\r\n          </>\r\n        )}\r\n      </div>\r\n    </";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK: Fragment fechado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancoras antes de continuar");
