const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Remover Encargos do bloco Geral
c = c.split(
  "          <NavItem path=\"/encargos\" icon=\"\uD83D\uDC77\" label=\"Encargos\" />\n"
).join('');

// 2. Adicionar bloco COLABORADORES com Encargos antes do separador do Fiscal
const blocoColaboradores =
  "        </div>\n\n" +
  "        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />\n\n" +
  "        {/* Colaboradores */}\n" +
  "        <div style={{ padding: '4px 10px' }}>\n" +
  "          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', padding: '0 8px', marginBottom: '4px' }}>Colaboradores</div>\n" +
  "          <NavItem path=\"/encargos\" icon=\"\uD83D\uDC77\" label=\"Encargos\" />\n";

c = c.split(
  "        </div>\n\n        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />\n\n        {/* Fiscal */"
).join(
  blocoColaboradores +
  "\n        </div>\n\n        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />\n\n        {/* Fiscal */"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
