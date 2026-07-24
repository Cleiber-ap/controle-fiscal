const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "{notif && (\r\n        <div style={{ background: '#0D3326', border: '1px solid rgba(52,211,153,0.3)', borderLeft: '3px solid #34D399', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: '#34D399' }}>\r\n          {notif}\r\n        </div>\r\n      )}";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "{notif && (\r\n        <>\r\n        <style>{`@keyframes slideInToast { from { opacity: 0; transform: translateY(-14px) } to { opacity: 1; transform: translateY(0) } }`}</style>\r\n        <div style={{ background: '#0D3326', border: '1px solid rgba(52,211,153,0.3)', borderLeft: '3px solid #34D399', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: '#34D399', animation: 'slideInToast 0.3s ease' }}>\r\n          {notif}\r\n        </div>\r\n        </>\r\n      )}";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - toast deslizando implementado no ExportarExcel");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
