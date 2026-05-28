const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Adicionar FAIXAS_SIMPLES antes do export default
const faixasConst =
  "const FAIXAS_SIMPLES = [\n" +
  "  { min: 0, max: 180000, aliq: 0.04, ded: 0, faixa: '1\u00AA', icms: 0.34 },\n" +
  "  { min: 180000.01, max: 360000, aliq: 0.073, ded: 5940, faixa: '2\u00AA', icms: 0.34 },\n" +
  "  { min: 360000.01, max: 720000, aliq: 0.095, ded: 13860, faixa: '3\u00AA', icms: 0.335 },\n" +
  "  { min: 720000.01, max: 1800000, aliq: 0.107, ded: 22500, faixa: '4\u00AA', icms: 0.335 },\n" +
  "  { min: 1800000.01, max: 3600000, aliq: 0.143, ded: 87300, faixa: '5\u00AA', icms: 0.335 },\n" +
  "  { min: 3600000.01, max: 4800000, aliq: 0.19, ded: 378000, faixa: '6\u00AA', icms: 0 },\n" +
  "]\n\n";

c = c.replace('export default function Inicio', faixasConst + 'export default function Inicio');

// 2. Adicionar computos antes de if (loading)
const computos =
  "  const rbt12 = (() => {\n" +
  "    let sum = 0\n" +
  "    for (let i = 0; i < 12; i++) {\n" +
  "      const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1)\n" +
  "      const m = d.getMonth() + 1; const a = d.getFullYear()\n" +
  "      sum += (histSix.find((r:any) => r.ano === a && r.mes === m)?.valor || 0)\n" +
  "      sum += (histEnova.find((r:any) => r.ano === a && r.mes === m)?.valor || 0)\n" +
  "    }\n" +
  "    return sum\n" +
  "  })()\n" +
  "  const faixaAtual = FAIXAS_SIMPLES.find(f => rbt12 >= f.min && rbt12 <= f.max) || FAIXAS_SIMPLES[FAIXAS_SIMPLES.length - 1]\n" +
  "  const aliqEfetiva = rbt12 > 0 ? (rbt12 * faixaAtual.aliq - faixaAtual.ded) / rbt12 : 0\n" +
  "  const icmsAproveitavel = aliqEfetiva * faixaAtual.icms\n" +
  "  const fatMes = vSixMes + vEnovaMes\n\n";

c = c.replace('  if (loading)', computos + '  if (loading)');

// 3. Bloco Simples Nacional UI
const ui =
  "\n\n      {/* Simples Nacional */}\n" +
  "      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>\n" +
  "        Simples Nacional \u2014 Faixas e Al\u00EDquota Efetiva\n" +
  "        <div style={{ flex: 1, height: '1px', background: '#252836' }} />\n" +
  "      </div>\n" +
  "      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>\n" +
  "        {[{label:'Faturamento do m\u00EAs',value:fmtR(fatMes),sub:mesAntNome+'/'+anoAnt,cor:'#E8EAF0'},{label:'RBT12 (12 meses)',value:fmtR(rbt12),sub:'Base de c\u00E1lculo',cor:'#E8EAF0'},{label:'Al\u00EDquota efetiva',value:(aliqEfetiva*100).toFixed(2).replace('.',',')+' %',sub:faixaAtual.faixa+' Faixa \u00B7 nominal '+(faixaAtual.aliq*100).toFixed(2)+'%',cor:'#4F8EF7'},{label:'ICMS aproveit\u00E1vel',value:(icmsAproveitavel*100).toFixed(2).replace('.',',')+' %',sub:(faixaAtual.icms*100).toFixed(1)+'% da al\u00EDquota efetiva',cor:'#34D399'}].map((card,i)=>(\n" +
  "          <div key={i} style={{background:'#13161F',border:'1px solid #252836',borderRadius:'10px',padding:'12px 14px'}}>\n" +
  "            <div style={{fontSize:'10px',fontWeight:600,color:'#7B82A0',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>{card.label}</div>\n" +
  "            <div style={{fontSize:'18px',fontWeight:700,color:card.cor,...mono}}>{card.value}</div>\n" +
  "            <div style={{fontSize:'10px',color:'#4A5070',marginTop:'3px'}}>{card.sub}</div>\n" +
  "          </div>\n" +
  "        ))}\n" +
  "      </div>\n" +
  "      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:'12px'}}>\n" +
  "        <div style={{background:'#13161F',border:'1px solid #252836',borderRadius:'12px',overflow:'hidden'}}>\n" +
  "          <div style={{padding:'10px 16px',borderBottom:'1px solid #252836'}}><span style={{fontSize:'10px',fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',color:'#4A5070'}}>Tabela Simples Nacional</span></div>\n" +
  "          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>\n" +
  "            <thead><tr style={{borderBottom:'1px solid #252836'}}>\n" +
  "              {['RB 12 meses (R$)','Al\u00EDquota','Dedu\u00E7\u00E3o (R$)','Faixa','ICMS'].map(h=>(<th key={h} style={{padding:'7px 10px',textAlign:h==='RB 12 meses (R$)'?'left':'right' as any,fontSize:'10px',fontWeight:600,color:'#4A5070',textTransform:'uppercase' as any,letterSpacing:'0.08em'}}>{h}</th>))}\n" +
  "            </tr></thead>\n" +
  "            <tbody>\n" +
  "              {FAIXAS_SIMPLES.map((f,i)=>{\n" +
  "                const ativa = f.faixa===faixaAtual.faixa\n" +
  "                return (\n" +
  "                  <tr key={i} style={{background:ativa?'rgba(79,142,247,0.08)':'transparent',borderBottom:'1px solid #1A1D2A'}}>\n" +
  "                    <td style={{padding:'7px 10px',color:ativa?'#4F8EF7':'#E8EAF0',fontWeight:ativa?600:400,...mono,fontSize:'11px'}}>{f.min.toLocaleString('pt-BR',{minimumFractionDigits:2})} \u2013 {f.max.toLocaleString('pt-BR',{minimumFractionDigits:2})}</td>\n" +
  "                    <td style={{padding:'7px 10px',textAlign:'right' as any,color:ativa?'#4F8EF7':'#7B82A0',fontWeight:ativa?600:400,...mono}}>{(f.aliq*100).toFixed(2).replace('.',',')}%</td>\n" +
  "                    <td style={{padding:'7px 10px',textAlign:'right' as any,color:ativa?'#4F8EF7':'#7B82A0',...mono}}>{f.ded.toLocaleString('pt-BR',{minimumFractionDigits:2})}</td>\n" +
  "                    <td style={{padding:'7px 10px',textAlign:'right' as any}}><span style={{background:ativa?'rgba(79,142,247,0.2)':'transparent',color:ativa?'#4F8EF7':'#7B82A0',padding:ativa?'2px 7px':'0',borderRadius:'4px',fontWeight:ativa?600:400}}>{f.faixa}{ativa?' \u2605':''}</span></td>\n" +
  "                    <td style={{padding:'7px 10px',textAlign:'right' as any,color:ativa?'#4F8EF7':'#7B82A0',...mono}}>{f.icms>0?(f.icms*100).toFixed(2).replace('.',',')+' %':'\u2014'}</td>\n" +
  "                  </tr>)\n" +
  "              })}\n" +
  "            </tbody>\n" +
  "          </table>\n" +
  "        </div>\n" +
  "        <div style={{background:'#13161F',border:'1px solid #252836',borderRadius:'12px',padding:'16px'}}>\n" +
  "          <div style={{fontSize:'10px',fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',color:'#4A5070',marginBottom:'12px'}}>C\u00E1lculo da al\u00EDquota efetiva</div>\n" +
  "          <div style={{marginBottom:'10px'}}><div style={{fontSize:'11px',color:'#7B82A0',marginBottom:'2px'}}>Faixa atual</div><div style={{fontSize:'15px',fontWeight:600,color:'#4F8EF7'}}>{faixaAtual.faixa} Faixa</div></div>\n" +
  "          <div style={{height:'1px',background:'#252836',margin:'10px 0'}} />\n" +
  "          {[{label:'Al\u00EDquota nominal',value:(faixaAtual.aliq*100).toFixed(2).replace('.',',')+' %'},{label:'Parcela a deduzir',value:'R$ '+faixaAtual.ded.toLocaleString('pt-BR',{minimumFractionDigits:2})}].map((row,i)=>(\n" +
  "            <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>{row.label}</span><span style={{fontSize:'12px',fontWeight:600,color:'#E8EAF0',...mono}}>{row.value}</span></div>\n" +
  "          ))}\n" +
  "          <div style={{height:'1px',background:'#252836',margin:'10px 0'}} />\n" +
  "          <div style={{fontSize:'10px',color:'#4A5070',marginBottom:'8px',fontStyle:'italic'}}>F\u00F3rmula: (RBT12 \u00D7 al\u00EDquota \u2212 PD) / RBT12</div>\n" +
  "          {[{label:'RBT12 \u00D7 '+(faixaAtual.aliq*100).toFixed(2)+'%',value:fmtR(rbt12*faixaAtual.aliq)},{label:'\u2212 Dedu\u00E7\u00E3o',value:fmtR(rbt12*faixaAtual.aliq-faixaAtual.ded)},{label:'Al\u00EDquota efetiva',value:(aliqEfetiva*100).toFixed(2).replace('.',',')+' %',destaque:true}].map((row:any,i)=>(\n" +
  "            <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>{row.label}</span><span style={{fontSize:row.destaque?'15px':'12px',fontWeight:600,color:row.destaque?'#34D399':'#E8EAF0',...mono}}>{row.value}</span></div>\n" +
  "          ))}\n" +
  "          <div style={{height:'1px',background:'#252836',margin:'10px 0'}} />\n" +
  "          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>ICMS da faixa</span><span style={{fontSize:'12px',fontWeight:600,color:'#E8EAF0',...mono}}>{faixaAtual.icms>0?(faixaAtual.icms*100).toFixed(1)+' %':'\u2014'}</span></div>\n" +
  "          <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>ICMS aproveit\u00E1vel</span><span style={{fontSize:'15px',fontWeight:700,color:'#34D399',...mono}}>{(icmsAproveitavel*100).toFixed(2).replace('.',',')+'%'}</span></div>\n" +
  "        </div>\n" +
  "      </div>";

c = c.replace(/(\s*<\/div>\s*\)\s*\n\})$/, ui + '\n    </div>\n  )\n}');

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
