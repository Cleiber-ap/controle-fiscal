const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx', 'utf8');

// Remover Empresas, Usuarios, XML do bloco Geral
c = c.replace(
  "          <NavItem path=\"/empresas\" icon=\"🏢\" label=\"Empresas\" />\r\n          <NavItem path=\"/usuarios\" icon=\"👤\" label=\"Usuários\" />\r\n          <NavItem path=\"/xml\" icon=\"📥\" label=\"Importar XML\" />\r\n        </div>",
  "        </div>"
);

// Remover Relatorios do bloco Fiscal
c = c.replace(
  "          <NavItem path=\"/relatorios\" icon=\"📈\" label=\"Relatórios\" cor=\"purple\" />\r\n        </div>",
  "        </div>"
);

// Adicionar novo bloco Configurações após o bloco Colaboradores
const colaboradoresEnd = "          <NavItem path=\"/encargos\" icon=\"👷\" label=\"Encargos\" />\r\n        </div>\r\n\r\n        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />";
const novoBloco = `          <NavItem path="/encargos" icon="👷" label="Encargos" />\r\n        </div>\r\n\r\n        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />\r\n\r\n        {/* Configurações */}\r\n        <div style={{ padding: '4px 10px' }}>\r\n          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', padding: '0 8px', marginBottom: '4px' }}>Configurações</div>\r\n          <NavItem path="/xml" icon="📥" label="Importar XML" />\r\n          <NavItem path="/relatorios" icon="📈" label="Relatórios" cor="purple" />\r\n          <NavItem path="/usuarios" icon="👤" label="Usuários" />\r\n          <NavItem path="/empresas" icon="🏢" label="Empresas" />\r\n        </div>`;

if (!c.includes(colaboradoresEnd)) { console.log('NAO ENCONTRADO: colaboradores end'); process.exit(1); }
c = c.replace(colaboradoresEnd, novoBloco);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx', c, 'utf8');
console.log('OK');
