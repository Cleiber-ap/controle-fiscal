const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar estado filtroMesPagto
c = c.replace(
  "  const [editMesLct, setEditMesLct] = useState('')",
  "  const [editMesLct, setEditMesLct] = useState('')\n  const [filtroMesPagto, setFiltroMesPagto] = useState('')"
);

// 2. Adicionar lista filtrada por data de pagamento apos ultimos4
c = c.replace(
  "  const isVendaOuParcial = (r: any) => {",
  `  const notasFiltradas = filtroMesPagto
    ? ultimos4.filter(r => {
        const lista = pagamentos[r.numero_nf] || []
        const dtPgto = r.dt_pagamento || r.data_pagamento
        if (lista.length > 0) {
          return lista.some((p: any) => {
            const dt = p.dt_pagamento || ''
            const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')
            const mm = parts[1]?.padStart(2,'0')
            const aa = parts[2]
            return (mm + '/' + aa) === filtroMesPagto
          })
        }
        if (!dtPgto) return false
        const parts = dtPgto.includes('-') ? dtPgto.split('-').reverse() : dtPgto.split('/')
        const mm = parts[1]?.padStart(2,'0')
        const aa = parts[2]
        return (mm + '/' + aa) === filtroMesPagto
      })
    : ultimos4

  const isVendaOuParcial = (r: any) => {`
);

// 3. Substituir ultimos4.map por notasFiltradas.map na tabela
c = c.replace("{ultimos4.map(r => {", "{notasFiltradas.map(r => {");

// 4. Atualizar contador de notas
c = c.replace(
  "{ultimos4.length} notas · {isSix ? 'SIX' : 'ENOVA'} · últimos 6 meses",
  "{notasFiltradas.length} notas · {isSix ? 'SIX' : 'ENOVA'} · últimos 6 meses"
);

// 5. Gerar opcoes de meses disponiveis a partir das notas
// Adicionar select no cabecalho da tabela (apos o span com total)
c = c.replace(
  "Total NF: <span style={{ color: corEmp, fontWeight: 700, ...mono }}>{fmtR(tNF)}</span>",
  `Total NF: <span style={{ color: corEmp, fontWeight: 700, ...mono }}>{fmtR(tNF)}</span>`
);

// 6. Adicionar select de filtro no header da tabela
c = c.replace(
  "<span style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0' }}>{notasFiltradas.length} notas · {isSix ? 'SIX' : 'ENOVA'} · últimos 6 meses</span>",
  `<div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0' }}>{notasFiltradas.length} notas · {isSix ? 'SIX' : 'ENOVA'} · últimos 6 meses</span>
              <select value={filtroMesPagto} onChange={e=>setFiltroMesPagto(e.target.value)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>
                <option value="">Todos os meses</option>
                {[...new Set(ultimos4.flatMap((r:any)=>{
                  const lista=pagamentos[r.numero_nf]||[]
                  if(lista.length>0) return lista.map((p:any)=>{ const dt=p.dt_pagamento||''; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); return parts[1]?.padStart(2,'0')+'/'+parts[2] })
                  const dtP=r.dt_pagamento||r.data_pagamento||''; if(!dtP) return []; const parts=dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); return [parts[1]?.padStart(2,'0')+'/'+parts[2]]
                })).filter(Boolean).sort()].map((m:any)=>(<option key={m} value={m}>{m}</option>))}
              </select>
            </div>`
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("filtroMesPagto") && c.includes("notasFiltradas") && c.includes("Todos os meses");
console.log(ok ? "OK" : "FALHOU");
