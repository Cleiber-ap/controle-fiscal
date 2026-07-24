const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar useRef ao import
const anchor1 = "import { useState, useEffect } from 'react'";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  c = c.replace(anchor1, "import { useState, useEffect, useRef } from 'react'");
  console.log("OK: useRef adicionado ao import");
}

// 2. Inserir componente ContadorAnimado antes de "export default function Encargos()"
const anchor2 = "export default function Encargos() {";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const componente = "function ContadorAnimado({ valor, cor, formatador }: { valor: number, cor: string, formatador: (n: number) => string }) {\n" +
"  const [exibido, setExibido] = useState(0)\n" +
"  const anterior = useRef(0)\n" +
"  useEffect(() => {\n" +
"    const inicio = anterior.current\n" +
"    const fim = valor\n" +
"    const duracao = 600\n" +
"    const t0 = performance.now()\n" +
"    let frameId: number\n" +
"    const passo = (t: number) => {\n" +
"      const p = Math.min(1, (t - t0) / duracao)\n" +
"      const ease = 1 - Math.pow(1 - p, 3)\n" +
"      setExibido(inicio + (fim - inicio) * ease)\n" +
"      if (p < 1) frameId = requestAnimationFrame(passo)\n" +
"      else anterior.current = fim\n" +
"    }\n" +
"    frameId = requestAnimationFrame(passo)\n" +
"    return () => cancelAnimationFrame(frameId)\n" +
"  }, [valor])\n" +
"  return <span style={{ color: cor }}>{formatador(exibido)}</span>\n" +
"}\n\n" +
anchor2;
  c = c.slice(0, idx2) + componente + c.slice(idx2 + anchor2.length);
  console.log("OK: componente ContadorAnimado adicionado");
}

// 3. Trocar {fmtR(c.valor)} pelo componente animado nos 4 cards
const anchor3 = "<div style={{ fontSize: 22, fontWeight: 700, color: c.cor, fontFamily: 'monospace' }}>{fmtR(c.valor)}</div>";
const idx3 = c.indexOf(anchor3);
if (idx3 === -1) { console.log("FALHOU: anchor3"); ok = false; }
else {
  c = c.replace(anchor3, "<div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace' }}><ContadorAnimado valor={c.valor} cor={c.cor} formatador={fmtR} /></div>");
  console.log("OK: os 4 cards usam ContadorAnimado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
