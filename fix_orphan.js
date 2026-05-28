const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');
// Remove o )} órfão antes do fechamento do painel direito
c = c.split("              </div>\n            )}\n          </div>\n        </div>").join(
  "              </div>\n          </div>\n        </div>"
);
fs.writeFileSync(p, c, 'utf8');
console.log('OK');
