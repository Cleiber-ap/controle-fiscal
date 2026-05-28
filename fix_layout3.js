const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// Substituir {/* Fiscal */} (unico no arquivo) pelo bloco Colaboradores + Fiscal
c = c.replace(
  /\{\/\* Fiscal \*\/\}/,
  "{/* Colaboradores */}\n        <div style={{ padding: '4px 10px' }}>\n          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', padding: '0 8px', marginBottom: '4px' }}>Colaboradores</div>\n          <NavItem path=\"/encargos\" icon=\"\uD83D\uDC77\" label=\"Encargos\" />\n        </div>\n\n        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />\n\n        {/* Fiscal */}"
);

fs.writeFileSync(p, c, 'utf8');
const check = c.includes('Colaboradores') ? 'OK - Colaboradores inserido' : 'FALHOU';
console.log(check);
