const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar busca DAS da CM
c = c.replace(
  "dasAPI.listar(1).then(r => r.data).catch(() => []),\n      dasAPI.listar(2).then(r => r.data).catch(() => []),",
  "dasAPI.listar(1).then(r => r.data).catch(() => []),\n      dasAPI.listar(2).then(r => r.data).catch(() => []),\n      dasAPI.listar(3).then(r => r.data).catch(() => []),"
);

// 2. Desestruturar dasCm
c = c.replace(
  "]).then(([h1, h2, h3, d1, d2, emp]) => {\n      setHistSix(h1); setHistEnova(h2); setHistCm(h3||[])\n      setDasSix(d1); setDasEnova(d2)",
  "]).then(([h1, h2, h3, d1, d2, d3, emp]) => {\n      setHistSix(h1); setHistEnova(h2); setHistCm(h3||[])\n      setDasSix(d1); setDasEnova(d2); setDasCm(d3||[])"
);

// 3. Adicionar useState dasCm
c = c.replace(
  "const [dasSix, setDasSix] = useState<any[]>([])",
  "const [dasSix, setDasSix] = useState<any[]>([])\n  const [dasCm, setDasCm] = useState<any[]>([])"
);

// 4. Incluir CM no total DAS
c = c.replace(
  "dasSix.reduce((s, r) => s + r.valor, 0) + dasEnova.reduce((s, r) => s + r.valor, 0)",
  "dasSix.reduce((s, r) => s + r.valor, 0) + dasEnova.reduce((s, r) => s + r.valor, 0) + dasCm.reduce((s, r) => s + r.valor, 0)"
);

// 5. Atualizar contagem de pagamentos
c = c.replace(
  "${dasSix.length + dasEnova.length} pagamentos confirmados",
  "${dasSix.length + dasEnova.length + dasCm.length} pagamentos confirmados"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("setDasCm") && c.includes("dasCm.reduce");
console.log(ok ? "OK" : "FALHOU");
