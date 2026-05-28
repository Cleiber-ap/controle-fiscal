const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "setDasValSix((vSix * empSix.aliquota_das).toFixed(2).replace('.', ','))",
  "setDasValSix((vSix * empSix.aliquota_das).toFixed(2).replace('.', ',')) // preenchido apos calculo"
);

fs.writeFileSync(f, c, "utf8");

// Na verdade precisamos usar impSix e impEnova, que sao calculados fora do useEffect
// A solucao correta: usar useEffect separado ou calcular inline
// Mais simples: remover o preenchimento do useEffect e usar useMemo/valor calculado direto no input

let c2 = fs.readFileSync(f, "utf8");

// Remover o preenchimento antigo do useEffect
c2 = c2.replace(
  "setDasValSix((vSix * empSix.aliquota_das).toFixed(2).replace('.', ',')) // preenchido apos calculo",
  ""
);
c2 = c2.replace(
  "setDasValEnova((vEnova * empEnova.aliquota_das).toFixed(2).replace('.', ','))",
  ""
);

// No input, o valor default quando vazio deve ser impSix/impEnova formatado
// Achar o input do campo e mudar o placeholder ou value padrao
c2 = c2.replace(
  "{ key: 'six', label: 'SIX', imp: impSix, conf: dasSixConf, cor: '#4F8EF7', val: dasValSix, setVal: setDasValSix },",
  "{ key: 'six', label: 'SIX', imp: impSix, conf: dasSixConf, cor: '#4F8EF7', val: dasValSix || impSix.toFixed(2).replace('.', ','), setVal: setDasValSix },"
);
c2 = c2.replace(
  "{ key: 'enova', label: 'ENOVA', imp: impEnova, conf: dasEnovaConf, cor: '#34D399', val: dasValEnova, setVal: setDasValEnova },",
  "{ key: 'enova', label: 'ENOVA', imp: impEnova, conf: dasEnovaConf, cor: '#34D399', val: dasValEnova || impEnova.toFixed(2).replace('.', ','), setVal: setDasValEnova },"
);

fs.writeFileSync(f, c2, "utf8");
const ok = c2.includes("impSix.toFixed") && c2.includes("impEnova.toFixed");
console.log(ok ? "OK" : "FALHOU");
