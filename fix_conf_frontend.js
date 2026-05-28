const fs = require("fs");
const path = require("path");
const base = "C:/projetos/controle-fiscal/frontend/src";

// 1. Criar pasta e arquivo da página
const dir = base + "/pages/Configuracoes";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});
const content = fs.readFileSync("C:/projetos/controle-fiscal/newfn.txt", "utf8");
fs.writeFileSync(dir + "/index.tsx", content, "utf8");
console.log("1. Página criada");

// 2. Adicionar import e rota no App.tsx
let app = fs.readFileSync(base + "/App.tsx", "utf8");
if (!app.includes("Configuracoes")) {
  app = app.replace(
    "import Auditoria from './pages/Auditoria'",
    "import Auditoria from './pages/Auditoria'\nimport Configuracoes from './pages/Configuracoes'"
  );
  app = app.replace(
    'path="/auditoria"',
    'path="/configuracoes" element={<Configuracoes />} />\n          <Route path="/auditoria"'
  );
  fs.writeFileSync(base + "/App.tsx", app, "utf8");
  console.log("2. Rota adicionada no App.tsx");
} else { console.log("2. Rota ja existe"); }

// 3. Atualizar Layout: trocar div sem link por NavItem
let layout = fs.readFileSync(base + "/components/Layout/index.tsx", "utf8");
const oldDiv = `<div
            style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', color: '#7B82A0', fontSize: '13px', fontWeight: 500 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = '#1A1D2A'; el.style.color = '#E8EAF0' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = 'transparent'; el.style.color = '#7B82A0' }}
          >
            <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>⚙️</span>
            Configurações
          </div>`;
if (layout.includes(oldDiv)) {
  layout = layout.replace(oldDiv, '<NavItem path="/configuracoes" icon="⚙️" label="Configurações" />');
  fs.writeFileSync(base + "/components/Layout/index.tsx", layout, "utf8");
  console.log("3. Layout atualizado");
} else {
  console.log("3. Layout - padrao nao encontrado, adicionando rota no titulo");
  // Adicionar /configuracoes ao paginas globais
  layout = layout.replace(
    "'/usuarios': 'Usuários',",
    "'/usuarios': 'Usuários',\n    '/configuracoes': 'Configurações',"
  );
  fs.writeFileSync(base + "/components/Layout/index.tsx", layout, "utf8");
  console.log("3. Layout - titulo adicionado");
}
console.log("DONE");
