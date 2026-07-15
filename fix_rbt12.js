const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', 'utf8');

// Corrigir calcRbt12: deve ir de mesAnt-1 até mesAnt-12 (excluindo o mês anterior)
c = c.replace(
  "const calcRbt12 = (hist: any[], ajustes: any[] = []) => { let sum = 0; for (let i=0;i<12;i++){const d=new Date(now.getFullYear(),now.getMonth()-i-1,1);",
  "const calcRbt12 = (hist: any[], ajustes: any[] = []) => { let sum = 0; for (let i=1;i<13;i++){const d=new Date(now.getFullYear(),now.getMonth()-i-1,1);"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', c, 'utf8');
console.log('OK');
