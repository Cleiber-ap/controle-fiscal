const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
lines[685] = `                              <td style={tdBase({ textAlign: 'center', width: '30px', maxWidth: '30px' })}>
                                {isVenda && <button onClick={async () => {
                                  const val = !(pg.ajustado || false)
                                  await api.put('/notas/ajustado/' + pg.id, { ajustado: val })
                                  carregarTudo()
                                }} style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid #4A5070', background: pg.ajustado ? '#34D399' : '#2A2D3E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {pg.ajustado && <span style={{ color: '#1A2A1A', fontSize: 10, fontWeight: 700 }}>?</span>}
                                </button>}
                              </td>`;
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
