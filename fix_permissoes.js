const fs = require('fs'); const path = require('path');
const dir = 'C:/projetos/controle-fiscal/frontend/src/utils';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + '/permissoes.ts', "// Helper de permiss\u00f5es\nexport function getUsuario() {\n  const s = localStorage.getItem('usuario')\n  return s ? JSON.parse(s) : null\n}\n\nexport function temPermissao(modulo: string, acao: 'visualizar' | 'editar' | 'incluir' | 'apagar' = 'visualizar'): boolean {\n  const usuario = getUsuario()\n  if (!usuario) return false\n  if (usuario.perfil === 'Admin') return true\n  return usuario.permissoes?.[modulo]?.[acao] === true\n}\n", 'utf8');

const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(path, 'utf8');

const r1 = "import { registrarLog } from '../../api/auditoria'";
const r1n = "import { registrarLog } from '../../api/auditoria'\nimport { temPermissao } from '../../utils/permissoes'";
if (!c.includes(r1)) { console.log('TRECHO 1 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(r1, r1n);

const r2 = "                    <button\n                      disabled={salvando === e.key}\n                      onClick={async () => {";
const r2n = "                    <button\n                      disabled={salvando === e.key || !temPermissao('inicio', 'editar')}\n                      onClick={async () => {";
if (!c.includes(r2)) { console.log('TRECHO 2 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(r2, r2n);

const r3 = "                      <button onClick={async()=>{\n                        await fetch('https://diligent-integrity-production-3f98.up.railway.app/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'autorizado'})})\n                        window.location.reload()\n                      }} style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>\n                        Autorizar\n                      </button>";
const r3n = "                      {temPermissao('inicio', 'editar') && <button onClick={async()=>{\n                        await fetch('https://diligent-integrity-production-3f98.up.railway.app/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'autorizado'})})\n                        window.location.reload()\n                      }} style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>\n                        Autorizar\n                      </button>}";
if (!c.includes(r3)) { console.log('TRECHO 3 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(r3, r3n);

fs.writeFileSync(path, c, 'utf8');
console.log('OK Inicio');

const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(path, 'utf8');

const r1 = "import { historicoAPI, empresasAPI } from '../../api/endpoints'";
const r1n = "import { historicoAPI, empresasAPI } from '../../api/endpoints'\nimport { temPermissao } from '../../utils/permissoes'";
if (!c.includes(r1)) { console.log('TRECHO 1 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(r1, r1n);

const r2 = "  {isVenda && <button onClick={() => {";
const r2n = "  {isVenda && temPermissao('contab', 'editar') && <button onClick={() => {";
if (!c.includes(r2)) { console.log('TRECHO 2 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(r2, r2n);

const r3 = "  {isVenda && isPaga && !temHistorico && <button onClick={() => limparPagamento(r.numero_nf)}";
const r3n = "  {isVenda && isPaga && !temHistorico && temPermissao('contab', 'apagar') && <button onClick={() => limparPagamento(r.numero_nf)}";
if (!c.includes(r3)) { console.log('TRECHO 3 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(r3, r3n);

const r4 = "                <button onClick={async () => {\n                  await api.post('/notas/creditos',";
const r4n = "                {temPermissao('contab', 'incluir') && <button onClick={async () => {\n                  await api.post('/notas/creditos',";
if (!c.includes(r4)) { console.log('TRECHO 4 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(r4, r4n);

const r5 = "                  carregarTudo()\n                }} style={{ padding: '5px 12px', background: 'rgba(167,139,250,0.15)', border: '1px solid #A78BFA',\nborderRadius: 6, color: '#A78BFA', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>\n                  Criar Cr\u00e9dito\n                </button>";
const r5n = "                  carregarTudo()\n                }} style={{ padding: '5px 12px', background: 'rgba(167,139,250,0.15)', border: '1px solid #A78BFA',\nborderRadius: 6, color: '#A78BFA', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>\n                  Criar Cr\u00e9dito\n                </button>}";
if (!c.includes(r5)) { console.log('TRECHO 5 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(r5, r5n);

fs.writeFileSync(path, c, 'utf8');
console.log('OK Contabilidade');
