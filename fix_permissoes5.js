const fs = require('fs');

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

// Botão Autorizar - localizar pelo style único
const styleAut = "style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>";
const idxStyle = cInicio.indexOf(styleAut);
console.log('idxStyle:', idxStyle);
if (idxStyle !== -1) {
  const idxBtn = cInicio.lastIndexOf('<button onClick={async()=>{', idxStyle);
  console.log('idxBtn:', idxBtn);
  const idxEnd = cInicio.indexOf('</button>', idxStyle) + '</button>'.length;
  const btnOriginal = cInicio.slice(idxBtn, idxEnd);
  const btnNovo = "{temPermissao('inicio', 'editar') && " + btnOriginal + "}";
  cInicio = cInicio.slice(0, idxBtn) + btnNovo + cInicio.slice(idxEnd);
  console.log('OK botao Autorizar');
} else {
  // Dump dos 50 chars ao redor de 'Autorizar'
  const idx2 = cInicio.indexOf('Autorizar');
  console.log('Contexto Autorizar:', JSON.stringify(cInicio.slice(Math.max(0,idx2-200), idx2+50)));
}

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', cInicio, 'utf8');
console.log('OK Inicio');
