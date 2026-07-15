const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Inserir setScrollParaAguardando(true) após cada await carregarTudo() relevante
// Usando indexOf para localizar cada ocorrência e inserir após

// 1. salvarPagamento - após carregarTudo, antes de setEditando(null)
const t1 = "await carregarTudo()\r\n      setEditando(null); setEditVPg(''); setEditDtp(''); setEditMesLct('')";
const t1n = "await carregarTudo()\r\n      setScrollParaAguardando(true)\r\n      setEditando(null); setEditVPg(''); setEditDtp(''); setEditMesLct('')";
if (!c.includes(t1)) { console.log('NAO ENCONTRADO t1'); } else { c = c.replace(t1, t1n); console.log('OK t1'); }

// 2. salvarPagamentoSaldo - após carregarTudo, antes de setEditando(null) sem setEditMesLct
const t2 = "await carregarTudo()\r\n      setEditando(null); setEditVPg(''); setEditDtp('')";
const t2n = "await carregarTudo()\r\n      setScrollParaAguardando(true)\r\n      setEditando(null); setEditVPg(''); setEditDtp('')";
if (!c.includes(t2)) { console.log('NAO ENCONTRADO t2'); } else { c = c.replace(t2, t2n); console.log('OK t2'); }

// 3. editarPagamento - após carregarTudo, antes de console.log Recarregado
const t3 = "await carregarTudo()\r\n      console.log('✅ Recarregado')";
const t3n = "await carregarTudo()\r\n      setScrollParaAguardando(true)\r\n      console.log('✅ Recarregado')";
if (!c.includes(t3)) { console.log('NAO ENCONTRADO t3'); } else { c = c.replace(t3, t3n); console.log('OK t3'); }

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK final');
