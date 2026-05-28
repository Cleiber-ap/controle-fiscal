const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "{temSaldoReal ? <span style={{ color: '#F87171', fontWeight: 600 }}>{fmtR(saldoTotal)}</span> : null}",
  "{temSaldoReal ? <span style={{ color: '#F87171', fontWeight: 600 }}>{fmtR(saldoTotal)}</span> : (isPaga && restante > 0.01 ? <span style={{ color: '#F87171', fontWeight: 600 }}>{fmtR(restante)}</span> : null)}"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("isPaga && restante > 0.01") ? "OK" : "FALHOU");
