const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/tdSm\({ textAlign: 'center' }\)}\{isVenda && <button onClick=\{async \(e\)/g, "tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })}{isVenda && <button onClick={async (e)");
c = c.replace(/tdSm\({ textAlign: 'center' }\)>\s*<button onClick=\{\(\) => \{ setEditandoPgto/g, "tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })>\n                                <button onClick={() => { setEditandoPgto");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
