const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

const antes = (c.match(/>Aplicar<\/button>/g) || []).length;
c = c.split(">Aplicar</button>").join(">Fechar</button>");
const depois = (c.match(/>Fechar<\/button>/g) || []).length;

fs.writeFileSync(f, c, "utf8");
console.log("OK - " + antes + " ocorrencias de Aplicar trocadas para Fechar");
