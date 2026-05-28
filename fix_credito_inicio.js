const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Adicionar estados para creditos
c = c.split(
  "const [ajustesSix, setAjustesSix] = useState<any[]>([])\n  const [ajustesEnova, setAjustesEnova] = useState<any[]>([])"
).join(
  "const [ajustesSix, setAjustesSix] = useState<any[]>([])\n  const [ajustesEnova, setAjustesEnova] = useState<any[]>([])\n  const [creditosSix, setCreditosSix] = useState<any[]>([])\n  const [creditosEnova, setCreditosEnova] = useState<any[]>([])"
);

// 2. Carregar creditos no Promise.all
c = c.split(
  "api.get('/notas/ajustes/1').then(r => r.data).catch(() => []),\n      api.get('/notas/ajustes/2').then(r => r.data).catch(() => []),"
).join(
  "api.get('/notas/ajustes/1').then(r => r.data).catch(() => []),\n      api.get('/notas/ajustes/2').then(r => r.data).catch(() => []),\n      api.get('/notas/creditos/1').then(r => r.data).catch(() => []),\n      api.get('/notas/creditos/2').then(r => r.data).catch(() => []),"
);

c = c.split(
  "]).then(([h1, h2, d1, d2, emp, pg1, pg2, n1, n2, aj1, aj2]) => {"
).join(
  "]).then(([h1, h2, d1, d2, emp, pg1, pg2, n1, n2, aj1, aj2, cr1, cr2]) => {"
);

c = c.split(
  "setAjustesSix(Array.isArray(aj1) ? aj1 : [])\n      setAjustesEnova(Array.isArray(aj2) ? aj2 : [])"
).join(
  "setAjustesSix(Array.isArray(aj1) ? aj1 : [])\n      setAjustesEnova(Array.isArray(aj2) ? aj2 : [])\n      setCreditosSix(Array.isArray(cr1) ? cr1 : [])\n      setCreditosEnova(Array.isArray(cr2) ? cr2 : [])"
);

// 3. Calcular credito autorizado por empresa antes do impTotal
c = c.split(
  "  const impSix = baseSixMLcto * aliqEfetivaSix"
).join(
  "  const creditoAutSix = creditosSix.filter(cr=>cr.status==='autorizado').reduce((s:number,cr:any)=>s+(cr.valor_nf_original*aliqEfetivaSix),0)\n" +
  "  const creditoAutEnova = creditosEnova.filter(cr=>cr.status==='autorizado').reduce((s:number,cr:any)=>s+(cr.valor_nf_original*aliqEfetivaEnova),0)\n" +
  "  const impSix = baseSixMLcto * aliqEfetivaSix"
);

// 4. Subtrair credito autorizado do imposto
c = c.split(
  "const impEnova = baseEnovaMLcto * aliqEfetivaEnova"
).join(
  "const impEnova = baseEnovaMLcto * aliqEfetivaEnova\n" +
  "  const impSixLiq = Math.max(0, impSix - creditoAutSix)\n" +
  "  const impEnovaLiq = Math.max(0, impEnova - creditoAutEnova)"
);

// 5. Usar imposto liquido no total
c = c.split(
  "const impTotal = impSix + impEnova"
).join(
  "const impTotal = impSixLiq + impEnovaLiq"
);

// 6. Atualizar exibicao por empresa para usar valor liquido
c = c.split(
  "{ key: 'six', label: 'SIX', imp: impSix,"
).join(
  "{ key: 'six', label: 'SIX', imp: impSixLiq, impBruto: impSix, credito: creditoAutSix,"
);
c = c.split(
  "{ key: 'enova', label: 'ENOVA', imp: impEnova,"
).join(
  "{ key: 'enova', label: 'ENOVA', imp: impEnovaLiq, impBruto: impEnova, credito: creditoAutEnova,"
);

// 7. Mostrar credito pendente com botao Autorizar e credito aplicado
const velhoConf = "              ) : (\n                <div>\n                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '5px' }}>";
const novoConf =
  "              ) : (\n                <div>\n" +
  "                  {(e.key==='six'?creditosSix:creditosEnova).filter((cr:any)=>cr.status==='pendente').map((cr:any)=>(\n" +
  "                    <div key={cr.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.3)',borderRadius:8,padding:'8px 12px',marginBottom:8}}>\n" +
  "                      <div style={{fontSize:11,color:'#A78BFA'}}>\n" +
  "                        \uD83D\uDFE2 Cr\u00e9dito Fiscal \u2014 NF {cr.nf_referenciada} \u00b7 R$ {(cr.valor_nf_original*(e.key==='six'?aliqEfetivaSix:aliqEfetivaEnova)).toLocaleString('pt-BR',{minimumFractionDigits:2})}\n" +
  "                      </div>\n" +
  "                      <button onClick={async()=>{\n" +
  "                        await fetch('http://localhost:8000/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'autorizado'})})\n" +
  "                        window.location.reload()\n" +
  "                      }} style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>\n" +
  "                        Autorizar\n" +
  "                      </button>\n" +
  "                    </div>\n" +
  "                  ))}\n" +
  "                  {e.credito > 0 && <div style={{fontSize:11,color:'#A78BFA',marginBottom:6,padding:'4px 8px',background:'rgba(167,139,250,0.08)',borderRadius:6}}>\u2713 Cr\u00e9dito autorizado aplicado: \u2212 {fmtR(e.credito)}</div>}\n" +
  "                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '5px' }}>";

c = c.split(velhoConf).join(novoConf);

// 8. Ao confirmar DAS, marcar creditos como utilizados
c = c.split(
  "window.location.reload()\n                        } catch { setSalvando('') }"
).join(
  "// Marcar creditos autorizados como utilizados\n" +
  "                          const crs = e.key==='six'?creditosSix:creditosEnova\n" +
  "                          for (const cr of crs.filter((x:any)=>x.status==='autorizado')) {\n" +
  "                            await fetch('http://localhost:8000/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'utilizado'})})\n" +
  "                          }\n" +
  "                          window.location.reload()\n" +
  "                        } catch { setSalvando('') }"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
