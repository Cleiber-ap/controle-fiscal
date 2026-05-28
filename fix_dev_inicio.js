const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Adicionar estados para ajustes
c = c.split(
  "const [notasSix, setNotasSix] = useState<any[]>([])\n  const [notasEnova, setNotasEnova] = useState<any[]>([])"
).join(
  "const [notasSix, setNotasSix] = useState<any[]>([])\n  const [notasEnova, setNotasEnova] = useState<any[]>([])\n  const [ajustesSix, setAjustesSix] = useState<any[]>([])\n  const [ajustesEnova, setAjustesEnova] = useState<any[]>([])"
);

// 2. Carregar ajustes no Promise.all
c = c.split(
  "api.get('/notas/1').then(r => r.data).catch(() => []),\n      api.get('/notas/2').then(r => r.data).catch(() => []),"
).join(
  "api.get('/notas/1').then(r => r.data).catch(() => []),\n      api.get('/notas/2').then(r => r.data).catch(() => []),\n      api.get('/notas/ajustes/1').then(r => r.data).catch(() => []),\n      api.get('/notas/ajustes/2').then(r => r.data).catch(() => []),"
);

// 3. Setar ajustes
c = c.split(
  "]).then(([h1, h2, d1, d2, emp, pg1, pg2, n1, n2]) => {"
).join(
  "]).then(([h1, h2, d1, d2, emp, pg1, pg2, n1, n2, aj1, aj2]) => {"
);

c = c.split(
  "setNotasSix(n1)\n      setNotasEnova(n2)"
).join(
  "setNotasSix(n1)\n      setNotasEnova(n2)\n      setAjustesSix(Array.isArray(aj1) ? aj1 : [])\n      setAjustesEnova(Array.isArray(aj2) ? aj2 : [])"
);

// 4. Atualizar calcRbt12 para aceitar ajustes
c = c.split(
  "  const calcRbt12 = (hist: any[]) => { let sum = 0; for (let i=0;i<12;i++){const d=new Date(now.getFullYear(),now.getMonth()-i-1,1);const m=d.getMonth()+1;const a=d.getFullYear();sum+=(hist.find((r:any)=>r.ano===a&&r.mes===m)?.valor||0)} return sum }"
).join(
  "  const calcRbt12 = (hist: any[], ajustes: any[] = []) => { let sum = 0; for (let i=0;i<12;i++){const d=new Date(now.getFullYear(),now.getMonth()-i-1,1);const m=d.getMonth()+1;const a=d.getFullYear();const fat=(hist.find((r:any)=>r.ano===a&&r.mes===m)?.valor||0);const dev=ajustes.filter((aj:any)=>aj.ano===a&&aj.mes===m).reduce((s:number,aj:any)=>s+aj.valor,0);sum+=fat-dev} return sum }"
);

// 5. Passar ajustes no calculo
c = c.split("  const rbt12Six = calcRbt12(histSix)").join("  const rbt12Six = calcRbt12(histSix, ajustesSix)");
c = c.split("  const rbt12Enova = calcRbt12(histEnova)").join("  const rbt12Enova = calcRbt12(histEnova, ajustesEnova)");

fs.writeFileSync(p, c, 'utf8');
console.log('Inicio OK');
