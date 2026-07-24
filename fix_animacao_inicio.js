const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar useRef ao import
const anchor1 = "import { useEffect, useState } from 'react'";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  c = c.replace(anchor1, "import { useEffect, useState, useRef } from 'react'");
  console.log("OK: useRef adicionado ao import");
}

// 2. Inserir componente ContadorAnimado antes de "export default function Inicio()"
const anchor2 = "export default function Inicio() {";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const componente = "function ContadorAnimado({ valor, cor, formatador }: { valor: number, cor: string, formatador: (n: number) => string }) {\r\n" +
"  const [exibido, setExibido] = useState(0)\r\n" +
"  const anterior = useRef(0)\r\n" +
"  useEffect(() => {\r\n" +
"    const inicio = anterior.current\r\n" +
"    const fim = valor\r\n" +
"    const duracao = 600\r\n" +
"    const t0 = performance.now()\r\n" +
"    let frameId: number\r\n" +
"    const passo = (t: number) => {\r\n" +
"      const p = Math.min(1, (t - t0) / duracao)\r\n" +
"      const ease = 1 - Math.pow(1 - p, 3)\r\n" +
"      setExibido(inicio + (fim - inicio) * ease)\r\n" +
"      if (p < 1) frameId = requestAnimationFrame(passo)\r\n" +
"      else anterior.current = fim\r\n" +
"    }\r\n" +
"    frameId = requestAnimationFrame(passo)\r\n" +
"    return () => cancelAnimationFrame(frameId)\r\n" +
"  }, [valor])\r\n" +
"  return <span style={{ color: cor }}>{formatador(exibido)}</span>\r\n" +
"}\r\n\r\n" +
anchor2;
  c = c.slice(0, idx2) + componente + c.slice(idx2 + anchor2.length);
  console.log("OK: componente ContadorAnimado adicionado");
}

// 3. Trocar {fmtR(e.imp)} pelo componente animado
const anchor3 = "{e.label} — {fmtR(e.imp)}";
const idx3 = c.indexOf(anchor3);
if (idx3 === -1) { console.log("FALHOU: anchor3"); ok = false; }
else {
  c = c.replace(anchor3, "{e.label} — <ContadorAnimado valor={e.imp} cor=\"inherit\" formatador={fmtR} />");
  console.log("OK: Imposto a Pagar usa ContadorAnimado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
