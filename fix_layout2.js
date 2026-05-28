const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Remover linha do Encargos do bloco Geral
c = c.replace(/[ \t]*<NavItem path="\/encargos"[^\n]*\n/, '');

// 2. Inserir bloco Colaboradores antes do separador do Fiscal
c = c.replace(
  /([ \t]*<\/div>\r?\n)([ \t]*<div style=\{\{ height: '1px'[^\n]*\n[ \t]*\{\/\* Fiscal \*\/\})/,
  '$1\n        <div style={{ height: \'1px\', background: \'#252836\', margin: \'6px 14px\' }} />\n\n        {/* Colaboradores */}\n        <div style={{ padding: \'4px 10px\' }}>\n          <div style={{ fontSize: \'10px\', fontWeight: 600, textTransform: \'uppercase\', letterSpacing: \'1.2px\', color: \'#4A5070\', padding: \'0 8px\', marginBottom: \'4px\' }}>Colaboradores</div>\n          <NavItem path="/encargos" icon="\uD83D\uDC77" label="Encargos" />\n        </div>\n\n        $2'
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
