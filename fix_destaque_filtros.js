const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const filtros = [
  { onClick: "setShowStatusMenu(p => !p)", cond: "filtroStatus.length > 0" },
  { onClick: "setShowPagtoMenu(p => !p)", cond: "filtroMesPagto.length > 0" },
  { onClick: "setShowContbMenu(p => !p)", cond: "filtroMesContb.length > 0" },
  { onClick: "setShowEmissaoMenu(p => !p)", cond: "filtroMesEmissao.length > 0" },
];

const styleOriginal = "style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}";

filtros.forEach(({ onClick, cond }) => {
  const anchor = "onClick={() => " + onClick + "} " + styleOriginal;
  const idx = c.indexOf(anchor);
  if (idx === -1) { console.log("FALHOU: " + onClick); ok = false; return; }
  const novoStyle = "style={{ background: (" + cond + ") ? 'rgba(79,142,247,0.15)' : '#1A1D2A', color: (" + cond + ") ? '#4F8EF7' : '#E8EAF0', border: (" + cond + ") ? '1px solid #4F8EF7' : '1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer', fontWeight: (" + cond + ") ? 600 : 400 }}";
  const novo = "onClick={() => " + onClick + "} " + novoStyle;
  c = c.replace(anchor, novo);
  console.log("OK: " + onClick);
});

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - destaque visual adicionado nos 4 filtros"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
