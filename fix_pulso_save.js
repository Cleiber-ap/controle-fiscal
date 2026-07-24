const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Novo state (junto com editContbVal)
const anchor1 = "const [editContbVal, setEditContbVal] = useState(\"\")";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  c = c.slice(0, idx1) + anchor1 + "\r\n  const [pulsando, setPulsando] = useState<Set<string>>(new Set())" + c.slice(idx1 + anchor1.length);
  console.log("OK: state pulsando adicionado");
}

// 2. Disparar pulso no onBlur da linha ORIGINAL (antes do setEditandoContb(null) final)
const anchor2 = "setEditandoContb(null)\n                                  }}\n                                  onKeyDown={e => { if (e.key === \"Enter\") (e.target as HTMLInputElement).blur() }}\n                                  placeholder=\"dd/mm/aaaa\"\n                                  style={{ width: \"72px\", background: \"#1A1D2A\", border: \"1px solid #4A5070\", borderRadius: \"3px\", color: \"#E4E7F0\", fontSize: \"11px\", padding: \"2px 4px\", textAlign: \"right\" }} />\n                              ) : (\n                                <>\n                                <span onClick={() => { setEditandoContb(contbId); setEditContbVal(contbAtual) }}\n                                  style={{ cursor: \"pointer\", color: ";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "setPulsando(prev => new Set([...prev, contbId]))\n                                    setTimeout(() => setPulsando(prev => { const n = new Set(prev); n.delete(contbId); return n }), 700)\n                                    setEditandoContb(null)\n                                  }}\n                                  onKeyDown={e => { if (e.key === \"Enter\") (e.target as HTMLInputElement).blur() }}\n                                  placeholder=\"dd/mm/aaaa\"\n                                  style={{ width: \"72px\", background: \"#1A1D2A\", border: \"1px solid #4A5070\", borderRadius: \"3px\", color: \"#E4E7F0\", fontSize: \"11px\", padding: \"2px 4px\", textAlign: \"right\" }} />\n                              ) : (\n                                <>\n                                <span onClick={() => { setEditandoContb(contbId); setEditContbVal(contbAtual) }}\n                                  style={{ cursor: \"pointer\", transition: \"background-color 0.4s\", backgroundColor: pulsando.has(contbId) ? \"rgba(52,211,153,0.35)\" : \"transparent\", borderRadius: \"4px\", padding: \"1px 4px\", color: ";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK: pulso na linha ORIGINAL adicionado");
}

// 3. Disparar pulso no onBlur da linha PARCIAL
const anchor3 = "await api.put(\"/notas/ajustado/\" + r.id, { ajustado: true })\n                                      }\n                                      setEditandoContb(null)\n     ";
const idx3 = c.indexOf(anchor3);
if (idx3 === -1) { console.log("FALHOU: anchor3"); ok = false; }
else {
  const novo3 = "await api.put(\"/notas/ajustado/\" + r.id, { ajustado: true })\n                                      }\n                                      setPulsando(prev => new Set([...prev, \"pgto-\" + pg.id]))\n                                      setTimeout(() => setPulsando(prev => { const n = new Set(prev); n.delete(\"pgto-\" + pg.id); return n }), 700)\n                                      setEditandoContb(null)\n     ";
  c = c.slice(0, idx3) + novo3 + c.slice(idx3 + anchor3.length);
  console.log("OK: pulso na linha PARCIAL adicionado");
}

// 4. Estilo animado no span da linha PARCIAL
const anchor4 = "<span onClick={() => { setEditandoContb(\"pgto-\" + pg.id); setEditContbVal(pg.data_contabilizacao || \"\") }}\n                                    style={{ cursor: \"pointer\", color: pg.data_contabilizacao ? \"#7B82A0\" : \"#4A5070\" }}>";
const idx4 = c.indexOf(anchor4);
if (idx4 === -1) { console.log("FALHOU: anchor4"); ok = false; }
else {
  const novo4 = "<span onClick={() => { setEditandoContb(\"pgto-\" + pg.id); setEditContbVal(pg.data_contabilizacao || \"\") }}\n                                    style={{ cursor: \"pointer\", transition: \"background-color 0.4s\", backgroundColor: pulsando.has(\"pgto-\" + pg.id) ? \"rgba(52,211,153,0.35)\" : \"transparent\", borderRadius: \"4px\", padding: \"1px 4px\", color: pg.data_contabilizacao ? \"#7B82A0\" : \"#4A5070\" }}>";
  c = c.slice(0, idx4) + novo4 + c.slice(idx4 + anchor4.length);
  console.log("OK: estilo animado na linha PARCIAL");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - pulso de confirmacao implementado"); }
else console.log("Corrigir ancoras antes de continuar");
