const fs = require("fs");

// Verificar como App.tsx envolve as páginas com Layout
const app = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/App.tsx", "utf8");
const lines = app.split('\n');
const rel = lines.filter(l => l.includes('Layout') || l.includes('PrivateRoute') || l.includes('configuracoes') || l.includes('auditoria'));
console.log("APP_LAYOUT:", JSON.stringify(rel.slice(0,10)));
