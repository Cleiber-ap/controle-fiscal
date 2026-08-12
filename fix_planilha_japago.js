const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Buscar tambem os pagamentos parciais de cada empresa
const a1 = "const [notasSix, notasEnova] = await Promise.all([\n" +
"      api.get('/notas/1').then(r => r.data).catch(() => []),\n" +
"      api.get('/notas/2').then(r => r.data).catch(() => []),\n" +
"    ])\n" +
"    const todasNotas = [...notasSix.map((n: any) => ({...n, empresa_id: 1})), ...notasEnova.map((n: any) => ({...n, empresa_id: 2}))]";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 fetch"); ok = false; }
else {
  const n1 = "const [notasSix, notasEnova, pgtosSix, pgtosEnova] = await Promise.all([\n" +
"      api.get('/notas/1').then(r => r.data).catch(() => []),\n" +
"      api.get('/notas/2').then(r => r.data).catch(() => []),\n" +
"      api.get('/notas/pagamentos/1').then(r => r.data).catch(() => ({})),\n" +
"      api.get('/notas/pagamentos/2').then(r => r.data).catch(() => ({})),\n" +
"    ])\n" +
"    const todasNotas = [...notasSix.map((n: any) => ({...n, empresa_id: 1})), ...notasEnova.map((n: any) => ({...n, empresa_id: 2}))]\n" +
"    const pagamentosPorEmpresa: Record<number, Record<string, any[]>> = { 1: pgtosSix, 2: pgtosEnova }";
  c = c.slice(0, i1) + n1 + c.slice(i1 + a1.length);
  console.log("OK 1: fetch de pagamentos adicionado");
}

// 2. Trocar a logica de ja_pago
const a2 = "resultado.push({\n" +
"        numero_nf: notaVenda.numero_nf,\n" +
"        empresa_id: notaVenda.empresa_id,\n" +
"        empresa: notaVenda.empresa_id === 1 ? 'SIX' : 'ENOVA',\n" +
"        destinatario: notaVenda.destinatario,\n" +
"        valor_nf: parseFloat(notaVenda.valor_nf) || 0,\n" +
"        valor_pago: valor,\n" +
"        data_pagamento: data,\n" +
"        ja_pago: notaVenda.valor_pago ? parseFloat(notaVenda.valor_pago) > 0 : false,\n" +
"        valor_atual: parseFloat(notaVenda.valor_pago) || 0,\n" +
"        id: notaVenda.id,\n" +
"      })";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 push"); ok = false; }
else {
  const n2 = "const listaPgExistentes = (pagamentosPorEmpresa[notaVenda.empresa_id] || {})[notaVenda.numero_nf] || []\n" +
"        let jaPago = false\n" +
"        if (listaPgExistentes.length > 0) {\n" +
"          jaPago = listaPgExistentes.some((p: any) => Math.abs((parseFloat(p.valor_pago) || 0) - valor) < 0.01 && p.dt_pagamento === data)\n" +
"        } else if (notaVenda.valor_pago) {\n" +
"          const dtNotaAtual = notaVenda.dt_pagamento || notaVenda.data_pagamento\n" +
"          jaPago = Math.abs((parseFloat(notaVenda.valor_pago) || 0) - valor) < 0.01 && dtNotaAtual === data\n" +
"        }\n" +
"        resultado.push({\n" +
"          numero_nf: notaVenda.numero_nf,\n" +
"          empresa_id: notaVenda.empresa_id,\n" +
"          empresa: notaVenda.empresa_id === 1 ? 'SIX' : 'ENOVA',\n" +
"          destinatario: notaVenda.destinatario,\n" +
"          valor_nf: parseFloat(notaVenda.valor_nf) || 0,\n" +
"          valor_pago: valor,\n" +
"          data_pagamento: data,\n" +
"          ja_pago: jaPago,\n" +
"          valor_atual: parseFloat(notaVenda.valor_pago) || 0,\n" +
"          id: notaVenda.id,\n" +
"        })";
  c = c.slice(0, i2) + n2 + c.slice(i2 + a2.length);
  console.log("OK 2: logica de ja_pago corrigida (compara valor+data especificos)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
