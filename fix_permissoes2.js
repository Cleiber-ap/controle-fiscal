const fs = require('fs');
const path = require('path');

// Criar utils/permissoes.ts
const dir = 'C:/projetos/controle-fiscal/frontend/src/utils';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + '/permissoes.ts', "// Helper de permiss\u00f5es\nexport function getUsuario() {\n  const s = localStorage.getItem('usuario')\n  return s ? JSON.parse(s) : null\n}\n\nexport function temPermissao(modulo: string, acao: 'visualizar' | 'editar' | 'incluir' | 'apagar' = 'visualizar'): boolean {\n  const usuario = getUsuario()\n  if (!usuario) return false\n  if (usuario.perfil === 'Admin') return true\n  return usuario.permissoes?.[modulo]?.[acao] === true\n}\n", 'utf8');
console.log('OK permissoes.ts');

// Fix Inicio
let cInicio = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', 'utf8');
const fixesInicio = [
  ["import { registrarLog } from '../../api/auditoria'", "import { registrarLog } from '../../api/auditoria'\nimport { temPermissao } from '../../utils/permissoes'"],
  ["                      disabled={salvando === e.key}\n                      onClick={async () => {", "                      disabled={salvando === e.key || !temPermissao('inicio', 'editar')}\n                      onClick={async () => {"],
  ["                      <button onClick={async()=>{\n                        await fetch('https://diligent-integrity-production-3f98.up.railway.app/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'autorizado'})})\n                        window.location.reload()\n                      }} style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>\n                        Autorizar\n                      </button>", "                      {temPermissao('inicio', 'editar') && <button onClick={async()=>{\n                        await fetch('https://diligent-integrity-production-3f98.up.railway.app/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'autorizado'})})\n                        window.location.reload()\n                      }} style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>\n                        Autorizar\n                      </button>}"],
];
for (const [from, to] of fixesInicio) {
  if (!cInicio.includes(from)) { console.log('NAO ENCONTRADO Inicio:', from.substring(0,50)); process.exit(1); }
  cInicio = cInicio.replace(from, to);
}
fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', cInicio, 'utf8');
console.log('OK Inicio');

// Fix Contabilidade
let cContab = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
const fixesContab = [
  ["import { historicoAPI, empresasAPI } from '../../api/endpoints'", "import { historicoAPI, empresasAPI } from '../../api/endpoints'\nimport { temPermissao } from '../../utils/permissoes'"],
  ["  {isVenda && <button onClick={() => {", "  {isVenda && temPermissao('contab', 'editar') && <button onClick={() => {"],
  ["  {isVenda && isPaga && !temHistorico && <button onClick={() => limparPagamento(r.numero_nf)}", "  {isVenda && isPaga && !temHistorico && temPermissao('contab', 'apagar') && <button onClick={() => limparPagamento(r.numero_nf)}"],
  ["                <button onClick={async () => {\n                  await api.post('/notas/creditos',", "                {temPermissao('contab', 'incluir') && <button onClick={async () => {\n                  await api.post('/notas/creditos',"],
  ["fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>\n                  Criar Cr\u00e9dito\n                </button>", "fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>\n                  Criar Cr\u00e9dito\n                </button>}"],
];
for (const [from, to] of fixesContab) {
  if (!cContab.includes(from)) { console.log('NAO ENCONTRADO Contab:', from.substring(0,50)); process.exit(1); }
  cContab = cContab.replace(from, to);
}
fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', cContab, 'utf8');
console.log('OK Contabilidade');
