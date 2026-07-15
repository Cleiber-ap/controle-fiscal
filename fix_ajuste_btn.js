const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 670; i < 690; i++) {
  if (lines[i] && lines[i].includes("tdSm({ textAlign: 'center' })}></td>") && lines[i+1] && lines[i+1].includes("tdSm({ textAlign: 'center' })") && lines[i+2] && lines[i+2].includes('setEditandoPgto')) {
    lines[i] = lines[i].replace(
      "tdSm({ textAlign: 'center' })}></td>",
      "tdSm({ textAlign: 'center' })}>{isVenda && <button onClick={async () => { const val = !(pg.ajustado || false); await api.put('/notas/ajustado/' + pg.id, { ajustado: val }); carregarTudo() }} style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid #4A5070', background: pg.ajustado ? '#34D399' : '#2A2D3E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pg.ajustado && <span style={{ color: '#0D0F17', fontSize: 10, fontWeight: 700 }}>?</span>}</button>}</td>"
    );
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
