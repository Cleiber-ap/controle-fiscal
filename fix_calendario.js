const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar funcoes de calendario antes do componente
const CALC_FN = `
// Calcula Pascoa (algoritmo de Gauss)
function calcPascoa(ano: number): Date {
  const a = ano % 19, b = Math.floor(ano/100), cc = ano % 100
  const d = Math.floor(b/4), e = b % 4, ff = Math.floor((b+8)/25)
  const g = Math.floor((b-ff+1)/3), h = (19*a+b-d-g+15) % 30
  const i = Math.floor(cc/4), k = cc % 4, l = (32+2*e+2*i-h-k) % 7
  const m = Math.floor((a+11*h+22*l)/451)
  const mes = Math.floor((h+l-7*m+114)/31)
  const dia = ((h+l-7*m+114) % 31)+1
  return new Date(ano, mes-1, dia)
}

function calcCalendario(mes: number, ano: number) {
  const pascoa = calcPascoa(ano)
  const addDias = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate()+n); return r }
  
  // Feriados fixos nacionais + SP
  const feriadosFixos = [
    [1,1],[25,1],[21,4],[1,5],[7,9],[12,10],[2,11],[15,11],[25,12],[9,7]
  ]
  // Feriados moveis
  const moveis = [
    addDias(pascoa,-48), // Carnaval 2a
    addDias(pascoa,-47), // Carnaval 3a
    addDias(pascoa,-2),  // Sexta Santa
    addDias(pascoa,60),  // Corpus Christi
  ]
  
  const ehFeriado = (d: Date): boolean => {
    const dm = d.getDate(), mm = d.getMonth()+1
    if (feriadosFixos.some(([dia,m]) => dia===dm && m===mm)) return true
    return moveis.some(f => f.getDate()===dm && f.getMonth()+1===mm && f.getFullYear()===d.getFullYear())
  }
  
  const diasMes = new Date(ano, mes, 0).getDate()
  let diasUteis=0, diasSegSab=0, domingosFeriados=0, diasVT=0
  
  for (let d=1; d<=diasMes; d++) {
    const dt = new Date(ano, mes-1, d)
    const dow = dt.getDay() // 0=dom, 6=sab
    const feriado = ehFeriado(dt)
    
    if (dow === 0) {
      // Domingo: conta sempre em domingosFeriados
      domingosFeriados++
    } else if (feriado) {
      // Feriado em dia útil (seg-sab): conta em domingosFeriados, nao conta em diasSegSab/diasVT
      domingosFeriados++
    } else {
      // Dia normal seg-sab
      diasSegSab++
      diasUteis++
      if (dow >= 1 && dow <= 5) diasVT++ // apenas seg-sex
    }
  }
  
  return { diasUteis, diasSegSab, domingosFeriados, diasVT }
}

`;

// Inserir antes do componente
c = c.replace(
  "export default function Encargos() {",
  CALC_FN + "export default function Encargos() {"
);

// 2. Inicializar estados com calculo automatico
c = c.replace(
  "  const [diasUteis, setDiasUteis] = useState(22)\n  const [domingosFeriados, setDomingosFeriados] = useState(6)\n  const [diasSegSab, setDiasSegSab] = useState(25)\n  const [diasVT, setDiasVT] = useState(20)",
  `  const calcInicial = calcCalendario(new Date().getMonth()===0?12:new Date().getMonth(), new Date().getMonth()===0?new Date().getFullYear()-1:new Date().getFullYear())
  const [diasUteis, setDiasUteis] = useState(calcInicial.diasUteis)
  const [domingosFeriados, setDomingosFeriados] = useState(calcInicial.domingosFeriados)
  const [diasSegSab, setDiasSegSab] = useState(calcInicial.diasSegSab)
  const [diasVT, setDiasVT] = useState(calcInicial.diasVT)`
);

// 3. Atualizar automaticamente quando mesRef muda
c = c.replace(
  "  useEffect(() => { carregar() }, [mesRef])",
  `  useEffect(() => {
    carregar()
    const cal = calcCalendario(mesRef.mes, mesRef.ano)
    setDiasUteis(cal.diasUteis)
    setDomingosFeriados(cal.domingosFeriados)
    setDiasSegSab(cal.diasSegSab)
    setDiasVT(cal.diasVT)
  }, [mesRef])`
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("calcPascoa") && c.includes("calcCalendario") && c.includes("cal.diasUteis");
console.log(ok ? "OK" : "FALHOU");
