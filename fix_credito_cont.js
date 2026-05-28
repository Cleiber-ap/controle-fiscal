const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Adicionar estado creditos
c = c.split(
  "const [filtroMesPagto, setFiltroMesPagto] = useState('')"
).join(
  "const [filtroMesPagto, setFiltroMesPagto] = useState('')\n  const [creditos, setCreditos] = useState<any[]>([])"
);

// 2. Carregar creditos junto com os outros dados
c = c.split(
  "api.get('/notas/' + outraEmpId).then(r => r.data).catch(() => []),"
).join(
  "api.get('/notas/' + outraEmpId).then(r => r.data).catch(() => []),\n      api.get('/notas/creditos/' + empId).then(r => r.data).catch(() => []),"
);

c = c.split(
  "const [n, h, emp, nOutra] = await Promise.all(["
).join(
  "const [n, h, emp, nOutra, creds] = await Promise.all(["
);

c = c.split(
  "setNotasOutra([...nOutra])"
).join(
  "setNotasOutra([...nOutra])\n    setCreditos(Array.isArray(creds) ? creds : [])"
);

// 3. Calcular valor do credito
c = c.split(
  "  const icmsAproveitavelCont = aliqEfetivaCont * (faixaCont as any).icms\n"
).join(
  "  const icmsAproveitavelCont = aliqEfetivaCont * (faixaCont as any).icms\n" +
  "  const creditosAtivos = creditos.filter(cr => cr.status === 'pendente' || cr.status === 'autorizado')\n" +
  "  const totalCredito = creditosAtivos.reduce((s: number, cr: any) => s + cr.valor_nf_original * aliqEfetivaCont, 0)\n"
);

// 4. Adicionar campo na linha de impostos
c = c.split(
  "{ label: '\uD83D\uDCB0 Imposto a Pagar (Regime de Caixa)', valor: fmtR(tPagoMLcto * aliqEfetivaCont), cor: '#34D399' },"
).join(
  "{ label: '\uD83D\uDCB0 Imposto a Pagar (Regime de Caixa)', valor: fmtR(tPagoMLcto * aliqEfetivaCont), cor: '#34D399' },\n" +
  "          ...(totalCredito > 0 ? [{ label: '\uD83D\uDFE2 Cr\u00e9dito Fiscal NF de entrada', valor: '\u2212 ' + fmtR(totalCredito), cor: '#A78BFA' }] : []),"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
