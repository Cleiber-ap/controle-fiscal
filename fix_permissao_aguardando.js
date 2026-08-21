const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "<td style={tdSm({ textAlign: 'center' })}>\r\n" +
"                              <button onClick={() => { setEditando(isSaldoEdit ? null : r.numero_nf + '-saldo'); setEditVPg(''); setEditDtp('') }}\r\n" +
"                                style={{ padding: '3px 9px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '5px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer' }}>✏️</button>\r\n" +
"                            </td>";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "<td style={tdSm({ textAlign: 'center' })}>\r\n" +
"                              {temPermissao('contab', 'editar') && <button onClick={() => { setEditando(isSaldoEdit ? null : r.numero_nf + '-saldo'); setEditVPg(''); setEditDtp('') }}\r\n" +
"                                style={{ padding: '3px 9px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '5px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer' }}>✏️</button>}\r\n" +
"                            </td>";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - botao editar da linha Aguardando agora respeita permissao contab/editar");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
