const fs = require("fs");
const f = "C:/projetos/controle-fiscal/backend/app/main.py";
let c = fs.readFileSync(f, "utf8");
c = c.replace(
  'app.include_router(auditoria_router',
  'app.include_router(funcionarios.router, prefix="/funcionarios", tags=["Funcionarios"])\napp.include_router(auditoria_router'
);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes('prefix="/funcionarios"') ? "OK" : "FALHOU");
