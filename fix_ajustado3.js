const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

const oldTd = `                          {isVenda && <input type="checkbox" checked={r.ajustado || false}
                            onChange={async (e) => {
                              const val = e.target.checked
                              // Atualizar otimisticamente
                              setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: val} : n))
                              await api.put('/notas/ajustado/' + r.id, { ajustado: val })
                            }}
                            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#34D399' }} />}`;

const newTd = `                          {isVenda && <button
                            onClick={async () => {
                              const val = !(r.ajustado || false)
                              setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: val} : n))
                              await api.put('/notas/ajustado/' + r.id, { ajustado: val })
                            }}
                            style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid #4A5070', background: r.ajustado ? '#34D399' : '#2A2D3E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {r.ajustado && <span style={{ color: '#0D0F17', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                          </button>}`;

if (!c.includes(oldTd)) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(oldTd, newTd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
