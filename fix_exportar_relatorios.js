const fs = require('fs');

// 1. Relatorios - envolver abas + botao exportar
const pr = 'C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx';
let r = fs.readFileSync(pr, 'utf8').replace(/\r\n/g, '\n');

r = r.split(
  "      {/* Abas */}\n      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#13161F', border: '1px solid #252836', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>"
).join(
  "      {/* Abas */}\n      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>\n        <div style={{ display: 'flex', gap: '4px', background: '#13161F', border: '1px solid #252836', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>"
);

r = r.split(
  "        )}\n      </div>\n      {/* ABA: Anual */}"
).join(
  "        )}\n        </div>\n        <button onClick={() => window.location.href='/exportar'} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid #252836', background: '#13161F', color: '#7B82A0', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }} onMouseEnter={e=>(e.currentTarget.style.color='#E8EAF0')} onMouseLeave={e=>(e.currentTarget.style.color='#7B82A0')}>\n          \uD83D\uDCCA Exportar Excel\n        </button>\n      </div>\n      {/* ABA: Anual */}"
);

fs.writeFileSync(pr, r, 'utf8');
console.log('Relatorios OK');

// 2. Layout - remover NavItem Exportar Excel
const pl = 'C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx';
let l = fs.readFileSync(pl, 'utf8').replace(/\r\n/g, '\n');

l = l.replace(/[ \t]*<NavItem path="\/exportar"[^\n]*\n/, '');

fs.writeFileSync(pl, l, 'utf8');
console.log('Layout OK');
