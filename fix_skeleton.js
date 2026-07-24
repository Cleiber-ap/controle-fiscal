const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "{loading ? <div style={{ padding: 24, textAlign: 'center', color: '#7B82A0' }}>Carregando...</div> : (";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "{loading ? (\r\n" +
"          <div style={{ padding: '20px 4px' }}>\r\n" +
"            <style>{`@keyframes skeletonPulse { 0%, 100% { opacity: 0.35 } 50% { opacity: 0.8 } }`}</style>\r\n" +
"            {[...Array(8)].map((_, i) => (\r\n" +
"              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, animation: 'skeletonPulse 1.4s ease-in-out infinite', animationDelay: (i * 0.06) + 's' }}>\r\n" +
"                <div style={{ height: 14, borderRadius: 4, background: '#252836', width: 60 }} />\r\n" +
"                <div style={{ height: 14, borderRadius: 4, background: '#252836', flex: 1 }} />\r\n" +
"                <div style={{ height: 14, borderRadius: 4, background: '#252836', width: 90 }} />\r\n" +
"                <div style={{ height: 14, borderRadius: 4, background: '#252836', width: 70 }} />\r\n" +
"                <div style={{ height: 14, borderRadius: 4, background: '#252836', width: 70 }} />\r\n" +
"                <div style={{ height: 14, borderRadius: 4, background: '#252836', width: 60 }} />\r\n" +
"              </div>\r\n" +
"            ))}\r\n" +
"          </div>\r\n" +
"        ) : (";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - skeleton loading implementado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
