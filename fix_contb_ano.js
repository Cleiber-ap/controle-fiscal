const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchorOld = `onBlur={async () => {
                                  setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, data_contabilizacao: editContbVal} : n))
                                  await api.put("/notas/contabilizacao/" + r.id, { data_contabilizacao: editContbVal })
                                  setEditandoContb(null)
                                }}`;

const idx = c.indexOf(anchorOld);
if (idx === -1) { console.log("FALHOU: anchorOld"); ok = false; }
else {
  const anchorNew = `onBlur={async () => {
                                  let val = editContbVal.trim()
                                  if (/^\\d{1,2}\\/\\d{1,2}$/.test(val)) {
                                    const [d, m] = val.split("/")
                                    val = d.padStart(2,"0") + "/" + m.padStart(2,"0") + "/" + new Date().getFullYear()
                                  }
                                  setEditContbVal(val)
                                  setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, data_contabilizacao: val} : n))
                                  await api.put("/notas/contabilizacao/" + r.id, { data_contabilizacao: val })
                                  setEditandoContb(null)
                                }}`;
  c = c.replace(anchorOld, anchorNew);
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - ano automatico adicionado"); }
else console.log("Corrigir ancora antes de continuar");
