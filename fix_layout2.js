const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx', 'utf8');

// Remover bloco Colaboradores (antes de Configurações)
const colaboradoresBloco = "\r\n        {/* Colaboradores */}\r\n        <div style={{ padding: '4px 10px' }}>\r\n          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', padding: '0 8px', marginBottom: '4px' }}>Colaboradores</div>\r\n          <NavItem path=\"/encargos\" icon=\"👷\" label=\"Encargos\" />\r\n        </div>\r\n\r\n        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />\r\n\r\n        {/* Configurações */}";

const colaboradoresBlocoNew = "\r\n        {/* Configurações */}";

if (!c.includes(colaboradoresBloco)) { console.log('NAO ENCONTRADO: colaboradores bloco'); process.exit(1); }
c = c.replace(colaboradoresBloco, colaboradoresBlocoNew);

// Adicionar Colaboradores após Configurações (antes do rodapé)
const configEnd = "          <NavItem path=\"/empresas\" icon=\"🏢\" label=\"Empresas\" />\r\n        </div>";
const configEndNew = `          <NavItem path="/empresas" icon="🏢" label="Empresas" />\r\n        </div>\r\n\r\n        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />\r\n\r\n        {/* Colaboradores */}\r\n        <div style={{ padding: '4px 10px' }}>\r\n          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', padding: '0 8px', marginBottom: '4px' }}>Colaboradores</div>\r\n          <NavItem path="/encargos" icon="👷" label="Encargos" />\r\n        </div>`;

if (!c.includes(configEnd)) { console.log('NAO ENCONTRADO: config end'); process.exit(1); }
c = c.replace(configEnd, configEndNew);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx', c, 'utf8');
console.log('OK');
