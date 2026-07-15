const fs = require('fs');

// Fix Inicio - botão Autorizar e Confirmar
let cInicio = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', 'utf8');

// Adicionar import
if (!cInicio.includes("from '../../utils/permissoes'")) {
  cInicio = cInicio.replace(
    "import { registrarLog } from '../../api/auditoria'",
    "import { registrarLog } from '../../api/auditoria'\nimport { temPermissao } from '../../utils/permissoes'"
  );
}

// Botão confirmar DAS
cInicio = cInicio.replace(
  'disabled={salvando === e.key}',
  "disabled={salvando === e.key || !temPermissao('inicio', 'editar')}"
);

// Botão Autorizar - buscar pelo texto único "Autorizar" e envolver o <button> com condicional
const idxAut = cInicio.indexOf('>\\r\\n                        Autorizar\\r\\n                      </button>');
if (idxAut === -1) {
  // tentar sem \r
  const idxAut2 = cInicio.indexOf('>\n                        Autorizar\n                      </button>');
  if (idxAut2 === -1) { console.log('NAO ENCONTRADO: Autorizar'); process.exit(1); }
}

// Abordagem diferente: substituir pelo padrão do style que é único
const styleAut = "style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>";
const idxStyle = cInicio.indexOf(styleAut);
if (idxStyle === -1) { console.log('NAO ENCONTRADO: style autorizar'); process.exit(1); }

// Achar o <button que vem antes
const idxBtn = cInicio.lastIndexOf('<button onClick={async()=>{', idxStyle);
if (idxBtn === -1) { console.log('NAO ENCONTRADO: button start'); process.exit(1); }

// Achar o </button> que vem depois
const idxEnd = cInicio.indexOf('</button>', idxStyle) + '</button>'.length;

const btnOriginal = cInicio.slice(idxBtn, idxEnd);
const btnNovo = "{temPermissao('inicio', 'editar') && " + btnOriginal + "}";

cInicio = cInicio.slice(0, idxBtn) + btnNovo + cInicio.slice(idxEnd);

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

// Botão ✏️ linha original - único padrão
cContab = cContab.replace(
  "  {isVenda && <button onClick={() => {",
  "  {isVenda && temPermissao('contab', 'editar') && <button onClick={() => {"
);

// Botão 🗑️ linha original
cContab = cContab.replace(
  "  {isVenda && isPaga && !temHistorico && <button onClick={() => limparPagamento(r.numero_nf)}",
  "  {isVenda && isPaga && !temHistorico && temPermissao('contab', 'apagar') && <button onClick={() => limparPagamento(r.numero_nf)}"
);

// Botão Criar Crédito
const idxCred = cContab.indexOf("await api.post('/notas/creditos',");
if (idxCred === -1) { console.log('NAO ENCONTRADO: criar credito'); process.exit(1); }
const idxCredBtn = cContab.lastIndexOf('<button onClick={async () => {', idxCred);
const idxCredEnd = cContab.indexOf('</button>', idxCred) + '</button>'.length;
const btnCred = cContab.slice(idxCredBtn, idxCredEnd);
cContab = cContab.slice(0, idxCredBtn) + "{temPermissao('contab', 'incluir') && " + btnCred + "}" + cContab.slice(idxCredEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', cContab, 'utf8');
console.log('OK Contabilidade');
