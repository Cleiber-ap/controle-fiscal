const fs = require("fs");
const base = "C:/projetos/controle-fiscal/frontend/src";

// 1. Criar pasta e arquivo da pagina
const dir = base + "/pages/Encargos";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});
const content = fs.readFileSync("C:/projetos/controle-fiscal/newfn.txt", "utf8");
fs.writeFileSync(dir + "/index.tsx", content, "utf8");
console.log("1. Pagina criada:", dir);

// 2. Adicionar import e rota no App.tsx
let app = fs.readFileSync(base + "/App.tsx", "utf8");
if (!app.includes("Encargos")) {
  app = app.replace(
    "import Configuracoes from './pages/Configuracoes'",
    "import Configuracoes from './pages/Configuracoes'\nimport Encargos from './pages/Encargos'"
  );
  app = app.replace(
    'path="/configuracoes"',
    'path="/encargos" element={<Layout><Encargos /></Layout>} />\n          <Route path="/configuracoes"'
  );
  fs.writeFileSync(base + "/App.tsx", app, "utf8");
  console.log("2. Rota adicionada");
}

// 3. Adicionar no Layout - apos Impostos Pagos
let layout = fs.readFileSync(base + "/components/Layout/index.tsx", "utf8");
if (!layout.includes("encargos")) {
  layout = layout.replace(
    "'/configuracoes': 'Configurações',",
    "'/configuracoes': 'Configurações',\n    '/encargos': 'Encargos',"
  );
  layout = layout.replace(
    '<NavItem path="/impostos" icon="📋" label="Impostos Pagos" />',
    '<NavItem path="/impostos" icon="📋" label="Impostos Pagos" />\n          <NavItem path="/encargos" icon="👷" label="Encargos" />'
  );
  fs.writeFileSync(base + "/components/Layout/index.tsx", layout, "utf8");
  console.log("3. Menu adicionado");
}
console.log("DONE");
