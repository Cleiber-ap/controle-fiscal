const fs = require('fs');
const pr = 'C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx';
let r = fs.readFileSync(pr, 'utf8').replace(/\r\n/g, '\n');

// Inserir botao + fechar outer div antes de {/* ABA: Anual */}
r = r.split("      </div>\n      {/* ABA: Anual */}").join(
  "        </div>\n" +
  "        <button onClick={() => window.location.href='/exportar'} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid #252836', background: '#13161F', color: '#7B82A0', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e=>(e.currentTarget.style.color='#E8EAF0')} onMouseLeave={e=>(e.currentTarget.style.color='#7B82A0')}>\n" +
  "          \uD83D\uDCCA Exportar Excel\n" +
  "        </button>\n" +
  "      </div>\n" +
  "      {/* ABA: Anual */}"
);

fs.writeFileSync(pr, r, 'utf8');
const ok = r.includes('Exportar Excel') && r.includes("window.location.href='/exportar'");
console.log(ok ? 'OK' : 'FALHOU');
