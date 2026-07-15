const fs = require('fs');
const path = require('path');

// Criar utils/permissoes.ts
const dir = 'C:/projetos/controle-fiscal/frontend/src/utils';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + '/permissoes.ts', "// Helper de permiss\u00f5es\nexport function getUsuario() {\n  const s = localStorage.getItem('usuario')\n  return s ? JSON.parse(s) : null\n}\n\nexport function temPermissao(modulo: string, acao: 'visualizar' | 'editar' | 'incluir' | 'apagar' = 'visualizar'): boolean {\n  const usuario = getUsuario()\n  if (!usuario) return false\n  if (usuario.perfil === 'Admin') return true\n  return usuario.permissoes?.[modulo]?.[acao] === true\n}\n", 'utf8');
console.log('OK permissoes.ts');

// Fix Inicio
let cInicio = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', 'utf8');

// Adicionar import
if (!cInicio.includes("from '../../utils/permissoes'")) {
  cInicio = cInicio.replace(
    "import { registrarLog } from '../../api/auditoria'",
    "import { registrarLog } from '../../api/auditoria'\nimport { temPermissao } from '../../utils/permissoes'"
  );
}

// Botão confirmar - buscar por indexOf e substituir cirurgicamente
const idxDis = cInicio.indexOf('disabled={salvando === e.key}');
if (idxDis === -1) { console.log('NAO ENCONTRADO: disabled confirmar'); process.exit(1); }
cInicio = cInicio.slice(0, idxDis) + 'disabled={salvando === e.key || !temPermissao(\'inicio\', \'editar\')}' + cInicio.slice(idxDis + 'disabled={salvando === e.key}'.length);

// Botão Autorizar - buscar por indexOf
const idxAut = cInicio.indexOf('} style={padding:\'4px 10px\',background:\'rgba(167,139,250,0.2)\'');
if (idxAut === -1) { console.log('NAO ENCONTRADO: botao autorizar'); process.exit(1); }
// Achar início do <button
const idxBtnStart = cInicio.lastIndexOf('<button onClick={async()=>{', idxAut);
const idxBtnEnd = cInicio.indexOf('</button>', idxAut) + '</button>'.length;
const btnAutorizar = cInicio.slice(idxBtnStart, idxBtnEnd);
cInicio = cInicio.slice(0, idxBtnStart) + '{temPermissao(\'inicio\', \'editar\') && ' + btnAutorizar + '}' + cInicio.slice(idxBtnEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', cInicio, 'utf8');
console.log('OK Inicio');

// Fix Contabilidade
let cContab = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Adicionar import
if (!cContab.includes("from '../../utils/permissoes'")) {
  cContab = cContab.replace(
    "import { historicoAPI, empresasAPI } from '../../api/endpoints'",
    "import { historicoAPI, empresasAPI } from '../../api/endpoints'\nimport { temPermissao } from '../../utils/permissoes'"
  );
}

// Botão ✏️ linha original
cContab = cContab.replace(
  '  {isVenda && <button onClick={() => {',
  '  {isVenda && temPermissao(\'contab\', \'editar\') && <button onClick={() => {'
);

// Botão 🗑️ linha original
cContab = cContab.replace(
  '  {isVenda && isPaga && !temHistorico && <button onClick={() => limparPagamento(r.numero_nf)}',
  '  {isVenda && isPaga && !temHistorico && temPermissao(\'contab\', \'apagar\') && <button onClick={() => limparPagamento(r.numero_nf)}'
);

// Botão Criar Crédito
const idxCred = cContab.indexOf("await api.post('/notas/creditos',");
if (idxCred === -1) { console.log('NAO ENCONTRADO: criar credito'); process.exit(1); }
const idxCredBtn = cContab.lastIndexOf('<button onClick={async () => {', idxCred);
const idxCredEnd = cContab.indexOf('</button>', idxCred) + '</button>'.length;
const btnCred = cContab.slice(idxCredBtn, idxCredEnd);
cContab = cContab.slice(0, idxCredBtn) + '{temPermissao(\'contab\', \'incluir\') && ' + btnCred + '}' + cContab.slice(idxCredEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', cContab, 'utf8');
console.log('OK Contabilidade');
