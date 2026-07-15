const fs = require('fs');
fs.writeFileSync('C:/projetos/controle-fiscal/backend/Dockerfile', 
'FROM python:3.13-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]\n',
'utf8');
console.log('OK');
