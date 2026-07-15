const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Substituir a lógica de parsing do CSV
const oldParse = `    // Detectar separador
    const sep = linhas[0].includes(';') ? ';' : ','
    const header = linhas[0].split(sep).map(h => h.trim().replace(/"/g, '').toLowerCase())`;

const newParse = `    // Parser CSV que respeita aspas (campos com vírgula dentro de aspas)
    function parseCSVLine(line: string): string[] {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
          inQuotes = !inQuotes
        } else if ((ch === ',' || ch === ';') && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += ch
        }
      }
      result.push(current.trim())
      return result
    }
    const header = parseCSVLine(linhas[0]).map(h => h.replace(/"/g, '').toLowerCase())
    const sep = ','  // não usado mas mantido para compatibilidade`;

if (!c.includes(oldParse)) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(oldParse, newParse);

// Substituir o split da linha de dados por parseCSVLine
c = c.replace(
  "      const cols = linhas[i].split(sep).map(c => c.trim().replace(/\"/g, ''))",
  "      const cols = parseCSVLine(linhas[i]).map(c => c.replace(/\"/g, ''))"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK');
