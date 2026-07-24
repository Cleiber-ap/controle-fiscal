const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "if (alvo) {\r\n          alvo.scrollIntoView({ behavior: 'smooth', block: 'center' })\r\n          alvo.style.outline = '2px solid #FBBF24'\r\n          setTimeout(() => { if (alvo) alvo.style.outline = '' }, 2000)\r\n        }";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "if (alvo) {\r\n" +
"          const elAlvo = alvo\r\n" +
"          const destino = elAlvo.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2)\r\n" +
"          const origem = window.scrollY\r\n" +
"          const distancia = destino - origem\r\n" +
"          const duracaoScroll = 700\r\n" +
"          const t0scroll = performance.now()\r\n" +
"          const passoScroll = (t: number) => {\r\n" +
"            const p = Math.min(1, (t - t0scroll) / duracaoScroll)\r\n" +
"            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2\r\n" +
"            window.scrollTo(0, origem + distancia * ease)\r\n" +
"            if (p < 1) requestAnimationFrame(passoScroll)\r\n" +
"          }\r\n" +
"          requestAnimationFrame(passoScroll)\r\n" +
"          elAlvo.style.transition = 'outline-color 0.5s ease, background-color 0.5s ease'\r\n" +
"          elAlvo.style.outline = '2px solid #FBBF24'\r\n" +
"          setTimeout(() => { elAlvo.style.outline = '2px solid transparent' }, 1500)\r\n" +
"        }";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - scroll com easing customizado implementado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
