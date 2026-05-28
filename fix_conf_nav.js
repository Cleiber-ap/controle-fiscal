const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Achar o bloco do div de Configuracoes e substituir por NavItem
// Usar regex para pegar o div inteiro
c = c.replace(
  /<NavItem path="\/auditoria"[^\/]+\/>\s*<div[\s\S]*?Configurações\s*<\/div>/,
  '<NavItem path="/auditoria" icon="📝" label="Log de Auditoria" />\n          <NavItem path="/configuracoes" icon="⚙️" label="Configurações" />'
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes('path="/configuracoes"') && !c.includes('onMouseEnter') || c.includes('NavItem path="/configuracoes"');
console.log(c.includes('NavItem path="/configuracoes"') ? "OK" : "FALHOU");
