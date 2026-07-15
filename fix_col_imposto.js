const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// 1. Adicionar cabeçalho da nova coluna após 'Dt. Pagto'
c = c.replace(
  "'Dt. Pagto','Status',''",
  "'Dt. Pagto','Imposto','Status',''"
);

// 2. Adicionar td da nova coluna na linha original, após a td de dt_pagamento
const tdDtPagto = "<td style={tdBase({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{temHistorico ? (lista[0]?.dt_pagamento || '—') : (r.dt_pagamento || r.data_pagamento || '—')}</td>";
const tdDtPagtoNew = `<td style={tdBase({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{temHistorico ? (lista[0]?.dt_pagamento || '—') : (r.dt_pagamento || r.data_pagamento || '—')}</td>
                        <td style={tdBase({ textAlign: 'right', ...mono, fontSize: '11px' })}>
                          {(() => {
                            const dtPg = temHistorico ? (lista[0]?.dt_pagamento || '') : (r.dt_pagamento || r.data_pagamento || '')
                            const parts = dtPg.includes('-') ? dtPg.split('-').reverse() : dtPg.split('/')
                            const mm = parseInt(parts[1])
                            const aa = parseInt(parts[2])
                            if (mm === mesAntIdx + 1 && aa === anoAnt && primeiroPagamento > 0) {
                              return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(primeiroPagamento * aliqEfetivaCont)}</span>
                            }
                            return <span style={{ color: '#4A5070' }}>—</span>
                          })()}
                        </td>`;

if (!c.includes(tdDtPagto)) { console.log('NAO ENCONTRADO: td dt_pagto'); process.exit(1); }
c = c.replace(tdDtPagto, tdDtPagtoNew);

// 3. Adicionar td vazia na linha de parciais (após td de dt_pagamento parcial)
const tdDtParcial = "<td style={tdSm({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{pg.dt_pagamento || '—'}</td>";
const tdDtParcialNew = `<td style={tdSm({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{pg.dt_pagamento || '—'}</td>
                              <td style={tdSm({ textAlign: 'right', ...mono, fontSize: '11px' })}>
                                {(() => {
                                  const dtPg = pg.dt_pagamento || ''
                                  const parts = dtPg.includes('-') ? dtPg.split('-').reverse() : dtPg.split('/')
                                  const mm = parseInt(parts[1])
                                  const aa = parseInt(parts[2])
                                  if (mm === mesAntIdx + 1 && aa === anoAnt && pg.valor_pago > 0) {
                                    return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(parseFloat(pg.valor_pago) * aliqEfetivaCont)}</span>
                                  }
                                  return <span style={{ color: '#4A5070' }}>—</span>
                                })()}
                              </td>`;

if (!c.includes(tdDtParcial)) { console.log('NAO ENCONTRADO: td dt parcial'); process.exit(1); }
c = c.replace(tdDtParcial, tdDtParcialNew);

// 4. Adicionar td vazia na linha "Aguardando" (próxima linha vazia)
const tdDtAguardando = "<td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>\r\n                            <td style={tdSm()}>"; 
const tdDtAguardandoNew = `<td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>
                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>
                            <td style={tdSm()}>`;

if (!c.includes(tdDtAguardando)) { console.log('NAO ENCONTRADO: td aguardando - tentando alternativa'); }
else { c = c.replace(tdDtAguardando, tdDtAguardandoNew); }

// 5. Adicionar td vazia no tfoot
c = c.replace(
  "<td></td><td></td><td></td><td></td>",
  "<td></td><td></td><td></td><td></td><td></td>"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
