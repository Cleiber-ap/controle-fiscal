const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Adicionar estados ajustes e ignorados
c = c.split(
  "const [creditos, setCreditos] = useState<any[]>([])"
).join(
  "const [creditos, setCreditos] = useState<any[]>([])\n  const [ajustes, setAjustes] = useState<any[]>([])\n  const [ignorados, setIgnorados] = useState<Set<number>>(new Set())"
);

// 2. Carregar ajustes no Promise.all
c = c.split(
  "api.get('/notas/creditos/' + empId).then(r => r.data).catch(() => []),"
).join(
  "api.get('/notas/creditos/' + empId).then(r => r.data).catch(() => []),\n      api.get('/notas/ajustes/' + empId).then(r => r.data).catch(() => []),"
);

c = c.split(
  "const [n, h, emp, nOutra, creds] = await Promise.all(["
).join(
  "const [n, h, emp, nOutra, creds, ajs] = await Promise.all(["
);

c = c.split(
  "setCreditos(Array.isArray(creds) ? creds : [])"
).join(
  "setCreditos(Array.isArray(creds) ? creds : [])\n    setAjustes(Array.isArray(ajs) ? ajs : [])"
);

// 3. Computar devolucoes elegiveis apos icmsAproveitavelCont
c = c.split(
  "  const icmsAproveitavelCont = aliqEfetivaCont * (faixaCont as any).icms\n"
).join(
  "  const icmsAproveitavelCont = aliqEfetivaCont * (faixaCont as any).icms\n" +
  "  const devElegiveis = ajustes.filter((aj: any) => {\n" +
  "    if (ignorados.has(aj.id)) return false\n" +
  "    const jaTemCredito = creditos.some((cr: any) => cr.nf_devolucao === aj.nf_devolucao)\n" +
  "    if (jaTemCredito) return false\n" +
  "    const nfDev = notas.find((n: any) => n.numero_nf === aj.nf_devolucao)\n" +
  "    if (!nfDev?.data_emissao) return false\n" +
  "    const [, mDev, aDev] = nfDev.data_emissao.split('/').map(Number)\n" +
  "    const mesSegOrig = aj.mes === 12 ? 1 : aj.mes + 1\n" +
  "    const anoSegOrig = aj.mes === 12 ? aj.ano + 1 : aj.ano\n" +
  "    return mDev === mesSegOrig && aDev === anoSegOrig\n" +
  "  })\n"
);

// 4. Adicionar secao de devolucoes elegiveis antes do quadro de notas fiscais
const marcador = "      {loading ? <div style={{ padding: 24, textAlign: 'center', color: '#7B82A0' }}>Carregando...</div> : (";
const secao =
  "      {devElegiveis.length > 0 && (\n" +
  "        <div style={{ background: '#13161F', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>\n" +
  "          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#A78BFA', marginBottom: 10 }}>\uD83D\uDFE2 Devolu\u00e7\u00f5es com Cr\u00e9dito Fiscal Eleg\u00edvel</div>\n" +
  "          {devElegiveis.map((aj: any) => (\n" +
  "            <div key={aj.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #252836' }}>\n" +
  "              <div>\n" +
  "                <div style={{ fontSize: 13, color: '#E8EAF0', fontWeight: 500 }}>NF {aj.nf_devolucao} \u2014 devolu\u00e7\u00e3o da NF {aj.nf_referenciada}</div>\n" +
  "                <div style={{ fontSize: 11, color: '#7B82A0', marginTop: 2 }}>Valor original: {fmtR(aj.valor)} \u00b7 Cr\u00e9dito estimado: {fmtR(aj.valor * aliqEfetivaCont)}</div>\n" +
  "              </div>\n" +
  "              <div style={{ display: 'flex', gap: 6 }}>\n" +
  "                <button onClick={async () => {\n" +
  "                  await api.post('/notas/creditos', { empresa_id: empId, valor_nf_original: aj.valor, nf_devolucao: aj.nf_devolucao, nf_referenciada: aj.nf_referenciada, mes_orig: aj.mes, ano_orig: aj.ano })\n" +
  "                  carregarTudo()\n" +
  "                }} style={{ padding: '5px 12px', background: 'rgba(167,139,250,0.15)', border: '1px solid #A78BFA', borderRadius: 6, color: '#A78BFA', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>\n" +
  "                  Criar Cr\u00e9dito\n" +
  "                </button>\n" +
  "                <button onClick={() => setIgnorados(prev => new Set([...prev, aj.id]))} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #2A2D3E', borderRadius: 6, color: '#7B82A0', fontSize: 11, cursor: 'pointer' }}>\n" +
  "                  Ignorar\n" +
  "                </button>\n" +
  "              </div>\n" +
  "            </div>\n" +
  "          ))}\n" +
  "        </div>\n" +
  "      )}\n";

c = c.split(marcador).join(secao + marcador);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
