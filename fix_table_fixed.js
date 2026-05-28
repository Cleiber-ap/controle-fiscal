const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// Adicionar table-layout fixed e colgroup
c = c.split(
  "<table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>\n" +
  "            <thead>"
).join(
  "<table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px',tableLayout:'fixed'}}>\n" +
  "              <colgroup><col style={{width:'38%'}}/><col style={{width:'13%'}}/><col style={{width:'22%'}}/><col style={{width:'15%'}}/><col style={{width:'12%'}}/></colgroup>\n" +
  "            <thead>"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
