const fs = require('fs');

let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', 'utf8');

// Localizar o <button do Confirmar pelo disabled único
const marker = "disabled={salvando === e.key || !temPermissao('inicio', 'editar')}";
const idxMarker = c.indexOf(marker);
if (idxMarker === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }

// Achar início do <button (linha anterior)
const idxBtn = c.lastIndexOf('<button', idxMarker);

// Achar o </button> correspondente
const idxEnd = c.indexOf('</button>', idxMarker) + '</button>'.length;

const btnOriginal = c.slice(idxBtn, idxEnd);

// Substituir disabled por sem disabled, e envolver com condicional
const btnSemDisabled = btnOriginal
  .replace("disabled={salvando === e.key || !temPermissao('inicio', 'editar')}", "disabled={salvando === e.key}");

const btnNovo = "{temPermissao('inicio', 'editar') && " + btnSemDisabled + "}";

c = c.slice(0, idxBtn) + btnNovo + c.slice(idxEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', c, 'utf8');
console.log('OK');
