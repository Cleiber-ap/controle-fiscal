const fs = require('fs');

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
