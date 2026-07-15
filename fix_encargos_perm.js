const fs = require('fs');

// Fix App.tsx - adicionar modulo encargos na rota
let cApp = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/App.tsx', 'utf8');
cApp = cApp.replace(
  "<Route path=\"/encargos\" element={<Layout><RotaProtegida><Encargos /></RotaProtegida></Layout>} />",
  "<Route path=\"/encargos\" element={<Layout><RotaProtegida modulo=\"encargos\"><Encargos /></RotaProtegida></Layout>} />"
);
fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/App.tsx', cApp, 'utf8');
console.log('OK App.tsx');

// Fix Encargos - ocultar botões de ação
let cEnc = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx', 'utf8');

// Adicionar import
if (!cEnc.includes("from '../../utils/permissoes'")) {
  cEnc = cEnc.replace(
    "import { registrarLog } from '../../api/auditoria'",
    "import { registrarLog } from '../../api/auditoria'\nimport { temPermissao } from '../../utils/permissoes'"
  );
}

// Botão + Novo Funcionário
cEnc = cEnc.replace(
  "<button style={st.btn('#34D399')} onClick={()=>{setEditando('novo');",
  "{temPermissao('encargos', 'incluir') && <button style={st.btn('#34D399')} onClick={()=>{setEditando('novo');"
);
// Fechar o JSX do botão Novo Funcionário
cEnc = cEnc.replace(
  ">+ Novo Funcionário</button>\n          </div>",
  ">+ Novo Funcionário</button>}\n          </div>"
);

// Botão Salvar funcionário
cEnc = cEnc.replace(
  "<button style={st.btn('#4F8EF7')} onClick={salvarFuncionario} disabled={salvando}>",
  "{temPermissao('encargos', 'editar') && <button style={st.btn('#4F8EF7')} onClick={salvarFuncionario} disabled={salvando}>"
);
cEnc = cEnc.replace(
  "{salvando?'Salvando...':'💾 Salvar'}</button>",
  "{salvando?'Salvando...':'💾 Salvar'}</button>}"
);

// Botões ✏️ e 🗑️ na tabela de funcionários
cEnc = cEnc.replace(
  "<button style={st.btn('#4F8EF7')} onClick={()=>{setEditando(f.id);setForm({...f})}}>✏️</button>",
  "{temPermissao('encargos', 'editar') && <button style={st.btn('#4F8EF7')} onClick={()=>{setEditando(f.id);setForm({...f})}}>✏️</button>}"
);
cEnc = cEnc.replace(
  "<button style={st.btn('#F87171')} onClick={()=>excluir(f.id,f.nome)}>🗑️</button>",
  "{temPermissao('encargos', 'apagar') && <button style={st.btn('#F87171')} onClick={()=>excluir(f.id,f.nome)}>🗑️</button>}"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx', cEnc, 'utf8');
console.log('OK Encargos');
