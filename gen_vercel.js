const fs = require('fs');
const content = JSON.stringify({
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}, null, 2);
fs.writeFileSync('C:/projetos/controle-fiscal/frontend/vercel.json', content, 'utf8');
console.log('OK');
