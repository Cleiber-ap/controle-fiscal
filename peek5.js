const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/backend/app/routers/notas.py", "utf8");
const i = c.indexOf("mes_lancamento = Column(String(10), nullable=True)");
console.log(JSON.stringify(c.substring(i-150, i+80)));
