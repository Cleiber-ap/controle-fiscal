const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Adicionar estado diasUteisProx
c = c.split(
  "const [diasVT, setDiasVT] = useState(20)"
).join(
  "const [diasVT, setDiasVT] = useState(20)\n  const [diasUteisProx, setDiasUteisProx] = useState(0)"
);

// 2. Calcular diasUteisProx no carregar()
c = c.split(
  "    setDiasVT(cal.diasVT)\n  }"
).join(
  "    setDiasVT(cal.diasVT)\n" +
  "    const proxMes = mesRef.mes === 12 ? 1 : mesRef.mes + 1\n" +
  "    const proxAno = mesRef.mes === 12 ? mesRef.ano + 1 : mesRef.ano\n" +
  "    const calProx = calcCalendario(proxMes, proxAno, getTodosOsFeriados(proxAno, feriadosLista))\n" +
  "    setDiasUteisProx(calProx.diasUteis)\n" +
  "  }"
);

// 3. Exibir no topo
c = c.split(
  "<span style={{ fontSize: 12, color: '#7B82A0', marginLeft: 8 }}>Dias \u00FAteis: <b style={{ color: '#E8EAF0' }}>{diasUteis}</b></span>"
).join(
  "<span style={{ fontSize: 12, color: '#7B82A0', marginLeft: 8 }}>Dias \u00FAteis: <b style={{ color: '#E8EAF0' }}>{diasUteis}</b></span>\n" +
  "          <span style={{ fontSize: 12, color: '#7B82A0', marginLeft: 16, borderLeft: '1px solid #252836', paddingLeft: 16 }}>\n" +
  "            {MESES[(mesRef.mes === 12 ? 0 : mesRef.mes)]} {mesRef.mes === 12 ? mesRef.ano + 1 : mesRef.ano}\n" +
  "            <span style={{ marginLeft: 6 }}>Dias \u00FAteis: <b style={{ color: '#E8EAF0' }}>{diasUteisProx}</b></span>\n" +
  "          </span>"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
