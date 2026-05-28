const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// Remove bloco Colaboradores se ja existir
c = c.replace(/\n\n?[ \t]*<div style=\{\{ height: '1px'[^\n]*\n[ \t]*\{\/\* Colaboradores \*\/\}[\s\S]*?<\/div>\n/, '\n');

// Inserir COLABORADORES apos o fechamento do bloco Fiscal (antes do rodape)
c = c.replace(
  /(\{\/\* Rodap)/,
  "{/* Colaboradores */}\n        <div style={{ padding: '4px 10px' }}>\n          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', padding: '0 8px', marginBottom: '4px' }}>Colaboradores</div>\n          <NavItem path=\"/encargos\" icon=\"\uD83D\uDC77\" label=\"Encargos\" />\n        </div>\n\n        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />\n\n        {/* Rodap"
);

fs.writeFileSync(p, c, 'utf8');
const ok = c.includes('Colaboradores') && !c.includes('/encargos" icon="\uD83D\uDC77" label="Encargos" />\n          <NavItem path="/inicio"');
console.log(ok ? 'OK' : 'verificar');
