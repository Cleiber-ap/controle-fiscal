const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "// Encontrar a nota de Venda entre as NFs da linha\n" +
"      let notaVenda: any = null\n" +
"      for (const nfNum of nfsLinha) {\n" +
"        const nota = todasNotas.find((n: any) => {\n" +
"          const numMatch = n.numero_nf === nfNum\n" +
"          const nat = (n.nat_operacao || n.status || '').toLowerCase(); const isVenda = nat.includes('venda') || nat.includes('complemento de frete')\n" +
"          // Filtrar por unidade se disponível\n" +
"          if (unidade && unidade.includes('six') && n.empresa_id !== 1) return false\n" +
"          if (unidade && unidade.includes('enova') && n.empresa_id !== 2) return false\n" +
"          return numMatch && isVenda\n" +
"        })\n" +
"        if (nota) { notaVenda = nota; break }\n" +
"      }";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "// Encontrar a nota correta entre as NFs da linha: primeiro tenta bater pelo VALOR, so cai para a primeira Venda/Complemento se nenhum valor bater\n" +
"      let notaVenda: any = null\n" +
"      const candidatosLinha: any[] = []\n" +
"      for (const nfNum of nfsLinha) {\n" +
"        const nota = todasNotas.find((n: any) => {\n" +
"          const numMatch = n.numero_nf === nfNum\n" +
"          const nat = (n.nat_operacao || n.status || '').toLowerCase(); const isVenda = nat.includes('venda') || nat.includes('complemento de frete') || nat.includes('complementar')\n" +
"          // Filtrar por unidade se disponível\n" +
"          if (unidade && unidade.includes('six') && n.empresa_id !== 1) return false\n" +
"          if (unidade && unidade.includes('enova') && n.empresa_id !== 2) return false\n" +
"          return numMatch && isVenda\n" +
"        })\n" +
"        if (nota) candidatosLinha.push(nota)\n" +
"      }\n" +
"      if (candidatosLinha.length === 1) {\n" +
"        notaVenda = candidatosLinha[0]\n" +
"      } else if (candidatosLinha.length > 1) {\n" +
"        notaVenda = candidatosLinha.find((n: any) => Math.abs((parseFloat(n.valor_nf) || 0) - (parseFloat(n.valor_pago) || 0) - valor) < 0.5)\n" +
"          || candidatosLinha.find((n: any) => Math.abs((parseFloat(n.valor_nf) || 0) - valor) < 0.5)\n" +
"          || candidatosLinha[0]\n" +
"      }";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - matching por valor implementado (evita direcionar pagamento para a NF errada quando ha varias na mesma celula)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
