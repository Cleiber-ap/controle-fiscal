const fs = require('fs');
const pr = 'C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx';
let r = fs.readFileSync(pr, 'utf8').replace(/\r\n/g, '\n');

// Remover todas as insercoes erradas do botao
r = r.replace(/\s*<\/div>\s*\n\s*<button onClick=\{\(\) => window\.location\.href='\/exportar'\}[\s\S]*?<\/button>\s*\n\s*<\/div>\s*\n(\s*\{\/\* ABA)/g, '\n      </div>\n      $1');

// Substituir a secao de abas completa
const novoTabs =
  "      {/* Abas */}\n" +
  "      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>\n" +
  "        <div style={{ display: 'flex', gap: '4px', background: '#13161F', border: '1px solid #252836', borderRadius: '10px', padding: '4px' }}>\n" +
  "          {[\n" +
  "            { key: 'anual', label: '\uD83D\uDCC5 Comparativo Anual' },\n" +
  "            { key: 'mensal', label: '\uD83D\uDCC8 Evolu\u00E7\u00E3o Mensal' },\n" +
  "            { key: 'impostos', label: '\uD83D\uDCB0 Impostos' },\n" +
  "          ].map(a => (\n" +
  "            <button key={a.key} onClick={() => setAbaAtiva(a.key as any)}\n" +
  "              style={{ padding: '7px 16px', borderRadius: '7px', border: 'none', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: abaAtiva === a.key ? '#252836' : 'transparent', color: abaAtiva === a.key ? '#E8EAF0' : '#7B82A0', transition: 'all .15s' }}>\n" +
  "              {a.label}\n" +
  "            </button>\n" +
  "          ))}\n" +
  "        </div>\n" +
  "        <button onClick={() => window.location.href='/exportar'} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid #252836', background: '#13161F', color: '#7B82A0', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e=>(e.currentTarget.style.color='#E8EAF0')} onMouseLeave={e=>(e.currentTarget.style.color='#7B82A0')}>\n" +
  "          \uD83D\uDCCA Exportar Excel\n" +
  "        </button>\n" +
  "      </div>\n";

r = r.replace(/\s*\{\/\* Abas \*\/\}[\s\S]*?\{\/\* ABA: Anual \*\/\}/, '\n' + novoTabs + '      {/* ABA: Anual */}');

fs.writeFileSync(pr, r, 'utf8');
const ok = r.includes('Exportar Excel') && (r.match(/Exportar Excel/g)||[]).length === 1;
console.log(ok ? 'OK' : 'FALHOU - count: ' + (r.match(/Exportar Excel/g)||[]).length);
