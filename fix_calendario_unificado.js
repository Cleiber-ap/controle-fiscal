const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Substituir calcCalendario (remove hardcode interno, usa só feriadosExtra)
const novaCalc =
  "function getTodosOsFeriados(ano: number, custom: any[] = []) {\n" +
  "  const p = calcPascoa(ano)\n" +
  "  const ad = (d:Date,n:number)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r}\n" +
  "  const fixos = [\n" +
  "    {dia:1,mes:1,descricao:'Confraterniza\u00E7\u00E3o Universal',tipo:'nacional'},\n" +
  "    {dia:25,mes:1,descricao:'Anivers\u00E1rio de S\u00E3o Paulo',tipo:'estadual'},\n" +
  "    {dia:21,mes:4,descricao:'Tiradentes',tipo:'nacional'},\n" +
  "    {dia:1,mes:5,descricao:'Dia do Trabalho',tipo:'nacional'},\n" +
  "    {dia:9,mes:7,descricao:'Revolu\u00E7\u00E3o Constitucionalista',tipo:'estadual'},\n" +
  "    {dia:7,mes:9,descricao:'Independ\u00EAncia do Brasil',tipo:'nacional'},\n" +
  "    {dia:12,mes:10,descricao:'Nossa Sra. Aparecida',tipo:'nacional'},\n" +
  "    {dia:2,mes:11,descricao:'Finados',tipo:'nacional'},\n" +
  "    {dia:15,mes:11,descricao:'Proclama\u00E7\u00E3o da Rep\u00FAblica',tipo:'nacional'},\n" +
  "    {dia:25,mes:12,descricao:'Natal',tipo:'nacional'},\n" +
  "    {dia:ad(p,-48).getDate(),mes:ad(p,-48).getMonth()+1,descricao:'Carnaval (2\u00AA)',tipo:'nacional'},\n" +
  "    {dia:ad(p,-47).getDate(),mes:ad(p,-47).getMonth()+1,descricao:'Carnaval (3\u00AA)',tipo:'nacional'},\n" +
  "    {dia:ad(p,-2).getDate(),mes:ad(p,-2).getMonth()+1,descricao:'Sexta-Feira Santa',tipo:'nacional'},\n" +
  "    {dia:ad(p,60).getDate(),mes:ad(p,60).getMonth()+1,descricao:'Corpus Christi',tipo:'nacional'},\n" +
  "  ]\n" +
  "  return [...fixos, ...custom]\n" +
  "}\n\n" +
  "function calcCalendario(mes: number, ano: number, feriadosExtra: Array<{dia: number, mes: number}> = []) {\n" +
  "  const diasMes = new Date(ano, mes, 0).getDate()\n" +
  "  let diasUteis=0, diasSegSab=0, domingosFeriados=0, diasVT=0\n" +
  "  for (let d=1; d<=diasMes; d++) {\n" +
  "    const dt = new Date(ano, mes-1, d)\n" +
  "    const dow = dt.getDay()\n" +
  "    const feriado = feriadosExtra.some(f => f.dia === d && f.mes === mes)\n" +
  "    if (dow === 0) { domingosFeriados++ }\n" +
  "    else if (feriado) { domingosFeriados++ }\n" +
  "    else { diasSegSab++; diasUteis++; if (dow >= 1 && dow <= 5) diasVT++ }\n" +
  "  }\n" +
  "  return { diasUteis, diasSegSab, domingosFeriados, diasVT }\n" +
  "}\n\n";

c = c.replace(/function calcPascoa[\s\S]*?(?=export default function Encargos)/, (match) => {
  const calcPascoaFn = match.match(/function calcPascoa[\s\S]*?\n\}\n/)[0];
  return calcPascoaFn + '\n' + novaCalc;
});

// 2. Atualizar carregar() para passar getTodosOsFeriados
c = c.replace(
  /const cal = calcCalendario\(mesRef\.mes, mesRef\.ano, feriadosLista\)/,
  "const cal = calcCalendario(mesRef.mes, mesRef.ano, getTodosOsFeriados(mesRef.ano, feriadosLista))"
);

// 3. Atualizar feriadosFixosMes para usar getTodosOsFeriados
c = c.replace(
  /const _pasc = calcPascoa[\s\S]*?const feriadosFixosMes[\s\S]*?\.map\(\(f:any\)=>\(\{\.\.\.f,id:'fixo_'[\s\S]*?\}\)\)\n/,
  "  const feriadosFixosMes = getTodosOsFeriados(mesRef.ano)\n" +
  "    .filter((f:any) => f.mes === mesRef.mes)\n" +
  "    .sort((a:any,b:any) => a.dia - b.dia)\n" +
  "    .map((f:any) => ({...f, id:'fixo_'+f.dia+'_'+f.mes, fixo:true}))\n"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
