const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Novos states
const anchorState = "const [editDtp, setEditDtp] = useState('\''\')";
if (c.indexOf(anchorState) === -1) { console.log("FALHOU: anchorState"); ok = false; }
else c = c.replace(anchorState, anchorState + "\n  const [editandoContb, setEditandoContb] = useState<string | null>(null)\n  const [editContbVal, setEditContbVal] = useState('\''\')");

// 2. Novo cabecalho <th> apos Dt. Pagto
const anchorTh = ">Dt. Pagto</th>";
if (c.indexOf(anchorTh) === -1) { console.log("FALHOU: anchorTh"); ok = false; }
else {
  const novoTh = "\n                    <th style={{ fontSize: '\''10px'\'', fontWeight: 600, textTransform: '\''uppercase'\'' as const, letterSpacing: '\''1px'\'', color: '\''#7B82A0'\'', borderBottom: '\''1px solid #252836'\'', whiteSpace: '\''nowrap'\'' as const, padding: '\''8px 12px'\'', textAlign: '\''right'\'' as const }}>DT.CONTB</th>";
  c = c.replace(anchorTh, anchorTh + novoTh);
}

// 3. Nova celula <td> editavel, apos a celula de Dt. Pagto da linha original
const anchorTd = `{temHistorico ? (lista[0]?.dt_pagamento || '\''\u2014'\'') : (r.dt_pagamento || r.data_pagamento || '\''\u2014'\'')}</td>`;
if (c.indexOf(anchorTd) === -1) { console.log("FALHOU: anchorTd"); ok = false; }
else {
  const novoTd = `
                          <td style={tdBase({ textAlign: '\''right'\'', ...mono, fontSize: '\''11px'\'' })}>
                            {editandoContb === r.numero_nf ? (
                              <input type="text" autoFocus value={editContbVal}
                                onChange={e => setEditContbVal(e.target.value)}
                                onBlur={async () => {
                                  setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, data_contabilizacao: editContbVal} : n))
                                  await api.put('\''/notas/contabilizacao/'\'' + r.id, { data_contabilizacao: editContbVal })
                                  setEditandoContb(null)
                                }}
                                onKeyDown={e => { if (e.key === '\''Enter'\'') (e.target as HTMLInputElement).blur() }}
                                placeholder="dd/mm/aaaa"
                                style={{ width: '\''72px'\'', background: '\''#1A1D2A'\'', border: '\''1px solid #4A5070'\'', borderRadius: '\''3px'\'', color: '\''#E4E7F0'\'', fontSize: '\''11px'\'', padding: '\''2px 4px'\'', textAlign: '\''right'\'' }} />
                            ) : (
                              <span onClick={() => { setEditandoContb(r.numero_nf); setEditContbVal(r.data_contabilizacao || '\''\'') }}
                                style={{ cursor: '\''pointer'\'', color: r.data_contabilizacao ? '\''#7B82A0'\'' : '\''#4A5070'\'' }}>
                                {r.data_contabilizacao || '\''\u2014'\''}
                              </span>
                            )}
                          </td>`;
  c = c.replace(anchorTd, anchorTd + novoTd);
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - frontend atualizado"); }
else console.log("Corrigir ancoras antes de continuar");
