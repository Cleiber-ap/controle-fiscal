const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Remover BOMs
c = c.replace(/\uFEFF/g, "");

// Fechar o try com catch antes do setGerando(null)
c = c.replace(
  "    showNotif(\"Relatorio gerado!\")\n    setGerando(null)",
  "    showNotif(\"Relatorio gerado!\")\n    } catch(err: any) { console.error(\"EXPORT_ERR:\", err?.message, err); showNotif(\"Erro: \" + err?.message) }\n    setGerando(null)"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("EXPORT_ERR") ? "OK" : "FALHOU");
