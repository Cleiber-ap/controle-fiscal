const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Adicionar FAIXAS_SIMPLES e calcPascoa antes do export default
const constantes =
  "const FAIXAS_CONT = [\n" +
  "  { min: 0, max: 180000, aliq: 0.04, ded: 0 },\n" +
  "  { min: 180000.01, max: 360000, aliq: 0.073, ded: 5940 },\n" +
  "  { min: 360000.01, max: 720000, aliq: 0.095, ded: 13860 },\n" +
  "  { min: 720000.01, max: 1800000, aliq: 0.107, ded: 22500 },\n" +
  "  { min: 1800000.01, max: 3600000, aliq: 0.143, ded: 87300 },\n" +
  "  { min: 3600000.01, max: 4800000, aliq: 0.19, ded: 378000 },\n" +
  "]\n\n";

c = c.replace('export default function Contabilidade', constantes + 'export default function Contabilidade');

// 2. Adicionar calculo de aliqEfetiva logo apos empDados
const computado =
  "  const rbt12Cont = (() => {\n" +
  "    let sum = 0\n" +
  "    for (let i = 0; i < 12; i++) {\n" +
  "      const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1)\n" +
  "      const m = d.getMonth() + 1; const a = d.getFullYear()\n" +
  "      sum += (hist.find((r:any) => r.ano === a && r.mes === m)?.valor || 0)\n" +
  "    }\n" +
  "    return sum\n" +
  "  })()\n" +
  "  const faixaCont = FAIXAS_CONT.find(f => rbt12Cont >= f.min && rbt12Cont <= f.max) || FAIXAS_CONT[FAIXAS_CONT.length - 1]\n" +
  "  const aliqEfetivaCont = rbt12Cont > 0 ? (rbt12Cont * faixaCont.aliq - faixaCont.ded) / rbt12Cont : empDados.aliquota_das\n";

c = c.replace(
  '  const nfsCanceladas = ',
  computado + '  const nfsCanceladas = '
);

// 3. Atualizar display Aliquota DAS (D17)
c = c.replace(
  '(empDados.aliquota_das * 100).toFixed(4)',
  '(aliqEfetivaCont * 100).toFixed(4)'
);

// 4. Atualizar calculos de imposto
c = c.split('base * empDados.aliquota_das').join('base * aliqEfetivaCont');
c = c.split('tPagoMLcto * empDados.aliquota_das').join('tPagoMLcto * aliqEfetivaCont');

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
