const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })}{isVenda && <button onClick={async (e)", "tdSm({ textAlign: 'center' })}{isVenda && <button onClick={async (e)");
c = c.replace("tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })>\n                                <button onClick={() => { setEditandoPgto", "tdSm({ textAlign: 'center', whiteSpace: 'nowrap' })>\n                                <button onClick={() => { setEditandoPgto");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
