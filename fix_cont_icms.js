const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Adicionar icms nas faixas
c = c.split("{ min: 0, max: 180000, aliq: 0.04, ded: 0 },").join("{ min: 0, max: 180000, aliq: 0.04, ded: 0, icms: 0.34 },");
c = c.split("{ min: 180000.01, max: 360000, aliq: 0.073, ded: 5940 },").join("{ min: 180000.01, max: 360000, aliq: 0.073, ded: 5940, icms: 0.34 },");
c = c.split("{ min: 360000.01, max: 720000, aliq: 0.095, ded: 13860 },").join("{ min: 360000.01, max: 720000, aliq: 0.095, ded: 13860, icms: 0.335 },");
c = c.split("{ min: 720000.01, max: 1800000, aliq: 0.107, ded: 22500 },").join("{ min: 720000.01, max: 1800000, aliq: 0.107, ded: 22500, icms: 0.335 },");
c = c.split("{ min: 1800000.01, max: 3600000, aliq: 0.143, ded: 87300 },").join("{ min: 1800000.01, max: 3600000, aliq: 0.143, ded: 87300, icms: 0.335 },");
c = c.split("{ min: 3600000.01, max: 4800000, aliq: 0.19, ded: 378000 },").join("{ min: 3600000.01, max: 4800000, aliq: 0.19, ded: 378000, icms: 0 },");

// 2. Adicionar icmsAproveitavelCont apos aliqEfetivaCont
c = c.split(
  "  const aliqEfetivaCont = rbt12Cont > 0 ? (rbt12Cont * faixaCont.aliq - faixaCont.ded) / rbt12Cont : empDados.aliquota_das\n"
).join(
  "  const aliqEfetivaCont = rbt12Cont > 0 ? (rbt12Cont * faixaCont.aliq - faixaCont.ded) / rbt12Cont : empDados.aliquota_das\n" +
  "  const icmsAproveitavelCont = aliqEfetivaCont * (faixaCont as any).icms\n"
);

// 3. Substituir display e remover (D18)
c = c.split("{ label: 'Cr\u00E9dito ICMS (D18)', valor: (empDados.credito_icms * 100).toFixed(4).replace('.', ',') + '%', cor: '#22D3EE' }").join(
  "{ label: 'Cr\u00E9dito ICMS', valor: (icmsAproveitavelCont * 100).toFixed(2).replace('.', ',') + '%', cor: '#22D3EE' }"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
