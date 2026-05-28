const fs = require("fs");
const f = "C:/projetos/controle-fiscal/backend/app/routers/funcionarios.py";
let c = fs.readFileSync(f, "utf8");
c = c.replace(
  'router = APIRouter(prefix="/funcionarios", tags=["funcionarios"])',
  'router = APIRouter(tags=["funcionarios"])'
);
fs.writeFileSync(f, c, "utf8");
console.log(!c.includes('prefix="/funcionarios"') ? "OK" : "FALHOU");
