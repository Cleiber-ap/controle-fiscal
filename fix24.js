const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  '    await registrarLog({ acao: "EXPORTAR", modulo: "excel", descricao: "Relatorio completo exportado" })\n    showNotif("Relatorio gerado!")',
  '    registrarLog({ acao: "EXPORTAR", modulo: "excel", descricao: "Relatorio completo exportado" }).catch(()=>{})\n    showNotif("Relatorio gerado!")'
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes('.catch(()=>{})') ? "OK" : "FALHOU");
