const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Inserir componente ContadorAnimado antes de "export default function Contabilidade()"
const anchor1 = "export default function Contabilidade() {";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  const componente = "function ContadorAnimado({ valor, cor, formatador }: { valor: number, cor: string, formatador: (n: number) => string }) {\r\n" +
"  const [exibido, setExibido] = useState(0)\r\n" +
"  const anterior = useRef(0)\r\n" +
"  useEffect(() => {\r\n" +
"    const inicio = anterior.current\r\n" +
"    const fim = valor\r\n" +
"    const duracao = 600\r\n" +
"    const t0 = performance.now()\r\n" +
"    let frameId: number\r\n" +
"    const passo = (t: number) => {\r\n" +
"      const p = Math.min(1, (t - t0) / duracao)\r\n" +
"      const ease = 1 - Math.pow(1 - p, 3)\r\n" +
"      setExibido(inicio + (fim - inicio) * ease)\r\n" +
"      if (p < 1) frameId = requestAnimationFrame(passo)\r\n" +
"      else anterior.current = fim\r\n" +
"    }\r\n" +
"    frameId = requestAnimationFrame(passo)\r\n" +
"    return () => cancelAnimationFrame(frameId)\r\n" +
"  }, [valor])\r\n" +
"  return <span style={{ color: cor }}>{formatador(exibido)}</span>\r\n" +
"}\r\n\r\n" +
anchor1;
  c = c.slice(0, idx1) + componente + c.slice(idx1 + anchor1.length);
  console.log("OK: componente ContadorAnimado adicionado");
}

// 2. Trocar valor:fmtR(...) por valorNum:... nos 3 cards
const anchor2 = "{ label: 'Total em NFs', valor: fmtR(tNF), sub: 'Notas Venda/Parcial de ' + mesAntNome + '/' + anoAnt, cor: '#4F8EF7' },\r\n" +
"          { label: 'Total Recebido', valor: fmtR(tPago), sub: 'Pago em ' + mesAntNome + '/' + anoAnt, cor: '#34D399' },\r\n" +
"          { label: 'Aguardando Pagamento', valor: fmtR(valAberto), sub: nfsAberto.filter(r => (parseFloat(r.valor_nf)||0)-(parseFloat(r.valor_pago)||0) > 0.01).length + ' em aberto · status Venda', cor: '#FBBF24' },";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "{ label: 'Total em NFs', valorNum: tNF, sub: 'Notas Venda/Parcial de ' + mesAntNome + '/' + anoAnt, cor: '#4F8EF7' },\r\n" +
"          { label: 'Total Recebido', valorNum: tPago, sub: 'Pago em ' + mesAntNome + '/' + anoAnt, cor: '#34D399' },\r\n" +
"          { label: 'Aguardando Pagamento', valorNum: valAberto, sub: nfsAberto.filter(r => (parseFloat(r.valor_nf)||0)-(parseFloat(r.valor_pago)||0) > 0.01).length + ' em aberto · status Venda', cor: '#FBBF24' },";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK: cards usam valorNum");
}

// 3. Trocar renderizacao {k.valor} pelo componente animado
const anchor3 = "<div style={{ fontSize: '22px', fontWeight: 700, ...mono, color: k.cor }}>{k.valor}</div>";
const idx3 = c.indexOf(anchor3);
if (idx3 === -1) { console.log("FALHOU: anchor3"); ok = false; }
else {
  const novo3 = "<div style={{ fontSize: '22px', fontWeight: 700, ...mono }}><ContadorAnimado valor={k.valorNum} cor={k.cor} formatador={fmtR} /></div>";
  c = c.replace(anchor3, novo3);
  console.log("OK: renderizacao usa ContadorAnimado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - animacao de contador implementada"); }
else console.log("Corrigir ancoras antes de continuar");
