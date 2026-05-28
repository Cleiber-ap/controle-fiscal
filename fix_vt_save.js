const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Converter campos numericos antes de enviar ao backend
c = c.replace(
  "      const method = form.id ? 'PUT' : 'POST'\n      const url = form.id ? API + '/funcionarios/' + form.id : API + '/funcionarios/'\n      await fetch(url, { method, headers: hdr(), body: JSON.stringify(form) })",
  `      const method = form.id ? 'PUT' : 'POST'
      const url = form.id ? API + '/funcionarios/' + form.id : API + '/funcionarios/'
      const numFields = ['salario_base','vale_alimentacao','salario_dinheiro','empresa_id','vale_transporte_valor','vale_alimentacao_desconto']
      const payload = {...form}
      numFields.forEach(k => { if(payload[k] !== undefined) payload[k] = parseFloat(String(payload[k]).replace(',','.')) || 0 })
      await fetch(url, { method, headers: hdr(), body: JSON.stringify(payload) })`
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("numFields") ? "OK" : "FALHOU");
