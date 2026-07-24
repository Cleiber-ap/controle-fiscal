const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const trocas = [
  ['<NavItem path="/dashboard" icon="📊" label="Painel" />', '{NavItem({ path: "/dashboard", icon: "📊", label: "Painel" })}'],
  ['<NavItem path="/inicio" icon="🏠" label="Início" />', '{NavItem({ path: "/inicio", icon: "🏠", label: "Início" })}'],
  ['<NavItem path="/faturamentos" icon="📋" label="Faturamentos" badge={15} />', '{NavItem({ path: "/faturamentos", icon: "📋", label: "Faturamentos", badge: 15 })}'],
  ['<NavItem path="/impostos" icon="💳" label="Impostos Pagos" />', '{NavItem({ path: "/impostos", icon: "💳", label: "Impostos Pagos" })}'],
  ['<NavItem path="/contabilidade" icon="🧾" label="Contabilidade" cor="purple" />', '{NavItem({ path: "/contabilidade", icon: "🧾", label: "Contabilidade", cor: "purple" })}'],
  ['<NavItem path="/xml" icon="📥" label="Importar XML" />', '{NavItem({ path: "/xml", icon: "📥", label: "Importar XML" })}'],
  ['<NavItem path="/relatorios" icon="📈" label="Relatórios" cor="purple" />', '{NavItem({ path: "/relatorios", icon: "📈", label: "Relatórios", cor: "purple" })}'],
  ['<NavItem path="/usuarios" icon="👤" label="Usuários" />', '{NavItem({ path: "/usuarios", icon: "👤", label: "Usuários" })}'],
  ['<NavItem path="/empresas" icon="🏢" label="Empresas" />', '{NavItem({ path: "/empresas", icon: "🏢", label: "Empresas" })}'],
  ['<NavItem path="/encargos" icon="👷" label="Encargos" />', '{NavItem({ path: "/encargos", icon: "👷", label: "Encargos" })}'],
  ['<NavItem path="/auditoria" icon="📝" label="Log de Auditoria" />', '{NavItem({ path: "/auditoria", icon: "📝", label: "Log de Auditoria" })}'],
  ['<NavItem path="/configuracoes" icon="⚙️" label="Configurações" />', '{NavItem({ path: "/configuracoes", icon: "⚙️", label: "Configurações" })}'],
];

let falhas = 0;
for (const [de, para] of trocas) {
  if (c.indexOf(de) === -1) { console.log("FALHOU: " + de); falhas++; continue; }
  c = c.replace(de, para);
}

if (falhas === 0) {
  fs.writeFileSync(f, c, "utf8");
  console.log("TUDO OK - 12 chamadas de NavItem convertidas para chamada direta (evita remount)");
} else {
  console.log(falhas + " ancoras falharam, nada foi salvo");
}
