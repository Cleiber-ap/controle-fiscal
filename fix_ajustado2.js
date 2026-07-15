const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Substituir o td do ajustado - adicionar isVenda e estado otimista
const oldTd = `                        <td style={tdBase({ textAlign: 'center' })}>
                          <input type="checkbox" checked={r.ajustado || false}
                            onChange={async (e) => {
                              await api.put('/notas/ajustado/' + r.id, { ajustado: e.target.checked })
                              await carregarTudo()
                            }}
                            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#34D399' }} />
                        </td>`;

const newTd = `                        <td style={tdBase({ textAlign: 'center' })}>
                          {isVenda && <input type="checkbox" checked={r.ajustado || false}
                            onChange={async (e) => {
                              const val = e.target.checked
                              // Atualizar otimisticamente
                              setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: val} : n))
                              await api.put('/notas/ajustado/' + r.id, { ajustado: val })
                            }}
                            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#34D399' }} />}
                        </td>`;

if (!c.includes(oldTd)) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(oldTd, newTd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
