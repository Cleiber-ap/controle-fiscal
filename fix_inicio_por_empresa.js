const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Substituir computed values (consolidado -> separado por empresa)
c = c.replace(
  /const rbt12[\s\S]*?const fatMes = vSixMes \+ vEnovaMes\n/,
  "  const calcRbt12 = (hist: any[]) => { let sum = 0; for (let i=0;i<12;i++){const d=new Date(now.getFullYear(),now.getMonth()-i-1,1);const m=d.getMonth()+1;const a=d.getFullYear();sum+=(hist.find((r:any)=>r.ano===a&&r.mes===m)?.valor||0)} return sum }\n" +
  "  const rbt12Six = calcRbt12(histSix)\n" +
  "  const rbt12Enova = calcRbt12(histEnova)\n" +
  "  const faixaSix = FAIXAS_SIMPLES.find(f=>rbt12Six>=f.min&&rbt12Six<=f.max)||FAIXAS_SIMPLES[FAIXAS_SIMPLES.length-1]\n" +
  "  const faixaEnova = FAIXAS_SIMPLES.find(f=>rbt12Enova>=f.min&&rbt12Enova<=f.max)||FAIXAS_SIMPLES[FAIXAS_SIMPLES.length-1]\n" +
  "  const aliqEfetivaSix = rbt12Six>0?(rbt12Six*faixaSix.aliq-faixaSix.ded)/rbt12Six:0\n" +
  "  const aliqEfetivaEnova = rbt12Enova>0?(rbt12Enova*faixaEnova.aliq-faixaEnova.ded)/rbt12Enova:0\n" +
  "  const icmsAproveitavelSix = aliqEfetivaSix*faixaSix.icms\n" +
  "  const icmsAproveitavelEnova = aliqEfetivaEnova*faixaEnova.icms\n"
);

// 2. Substituir bloco UI do Simples Nacional
const snStart = c.indexOf('{/* Simples Nacional */}');
const closing = '    </div>\n  )\n}';
const closingPos = c.lastIndexOf(closing);

const novoUI =
  "{/* Simples Nacional */}\n" +
  "      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>\n" +
  "        Simples Nacional \u2014 por Empresa\n" +
  "        <div style={{ flex: 1, height: '1px', background: '#252836' }} />\n" +
  "      </div>\n" +
  "      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>\n" +
  "        <div style={{ padding: '10px 16px', borderBottom: '1px solid #252836' }}><span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070' }}>Tabela Simples Nacional</span></div>\n" +
  "        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>\n" +
  "          <thead><tr style={{ borderBottom: '1px solid #252836' }}>{['RB 12 meses (R$)', 'Al\u00EDquota', 'Dedu\u00E7\u00E3o (R$)', 'Faixa', 'ICMS'].map(h => (<th key={h} style={{ padding: '7px 10px', textAlign: h === 'RB 12 meses (R$)' ? 'left' : 'right' as any, fontSize: '10px', fontWeight: 600, color: '#4A5070', textTransform: 'uppercase' as any }}>{h}</th>))}</tr></thead>\n" +
  "          <tbody>{FAIXAS_SIMPLES.map((f, i) => {\n" +
  "            const ativaSix = f.faixa === faixaSix.faixa\n" +
  "            const ativaEnova = f.faixa === faixaEnova.faixa\n" +
  "            const ativa = ativaSix || ativaEnova\n" +
  "            return (<tr key={i} style={{ background: ativa ? 'rgba(79,142,247,0.06)' : 'transparent', borderBottom: '1px solid #1A1D2A' }}>\n" +
  "              <td style={{ padding: '7px 10px', color: ativa ? '#E8EAF0' : '#7B82A0', ...mono, fontSize: '11px' }}>{f.min.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} \u2013 {f.max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>\n" +
  "              <td style={{ padding: '7px 10px', textAlign: 'right' as any, color: ativa ? '#E8EAF0' : '#7B82A0', ...mono }}>{(f.aliq * 100).toFixed(2).replace('.', ',')}%</td>\n" +
  "              <td style={{ padding: '7px 10px', textAlign: 'right' as any, color: ativa ? '#E8EAF0' : '#7B82A0', ...mono }}>{f.ded.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>\n" +
  "              <td style={{ padding: '7px 10px', textAlign: 'right' as any }}>\n" +
  "                <span style={{ fontSize: '10px', color: '#7B82A0' }}>{f.faixa}</span>\n" +
  "                {ativaSix && <span style={{ marginLeft: '4px', background: 'rgba(79,142,247,0.2)', color: '#4F8EF7', fontSize: '10px', fontWeight: 600, padding: '1px 5px', borderRadius: '3px' }}>SIX</span>}\n" +
  "                {ativaEnova && <span style={{ marginLeft: '4px', background: 'rgba(52,211,153,0.2)', color: '#34D399', fontSize: '10px', fontWeight: 600, padding: '1px 5px', borderRadius: '3px' }}>ENOVA</span>}\n" +
  "              </td>\n" +
  "              <td style={{ padding: '7px 10px', textAlign: 'right' as any, color: ativa ? '#E8EAF0' : '#7B82A0', ...mono }}>{f.icms > 0 ? (f.icms * 100).toFixed(2).replace('.', ',') + ' %' : '\u2014'}</td>\n" +
  "            </tr>)\n" +
  "          })}</tbody>\n" +
  "        </table>\n" +
  "      </div>\n" +
  "      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>\n" +
  "        {[{label:'SIX',rbt12:rbt12Six,faixa:faixaSix,aliqEfetiva:aliqEfetivaSix,icms:icmsAproveitavelSix,fatMes:vSixMes,cor:'#4F8EF7'},{label:'ENOVA',rbt12:rbt12Enova,faixa:faixaEnova,aliqEfetiva:aliqEfetivaEnova,icms:icmsAproveitavelEnova,fatMes:vEnovaMes,cor:'#34D399'}].map((emp,i)=>(\n" +
  "          <div key={i} style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '12px', padding: '16px' }}>\n" +
  "            <div style={{ fontSize: '12px', fontWeight: 700, color: emp.cor, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>\n" +
  "              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: emp.cor, display: 'inline-block' }} />{emp.label}\n" +
  "            </div>\n" +
  "            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>\n" +
  "              {[{l:'Faturamento m\u00EAs',v:fmtR(emp.fatMes)},{l:'RBT12',v:fmtR(emp.rbt12)}].map((m,j)=>(\n" +
  "                <div key={j} style={{ background: '#0E1017', borderRadius: '6px', padding: '8px 10px' }}>\n" +
  "                  <div style={{ fontSize: '10px', color: '#7B82A0', marginBottom: '3px' }}>{m.l}</div>\n" +
  "                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0', ...mono }}>{m.v}</div>\n" +
  "                </div>\n" +
  "              ))}\n" +
  "            </div>\n" +
  "            <div style={{ height: '1px', background: '#252836', margin: '8px 0' }} />\n" +
  "            <div style={{ marginBottom: '6px' }}><span style={{ fontSize: '11px', color: '#7B82A0' }}>Faixa atual</span> <span style={{ fontSize: '12px', fontWeight: 600, color: emp.cor }}>{emp.faixa.faixa} Faixa</span></div>\n" +
  "            {[{l:'Al\u00EDquota nominal',v:(emp.faixa.aliq*100).toFixed(2).replace('.',',')+' %'},{l:'Dedu\u00E7\u00E3o',v:'R$ '+emp.faixa.ded.toLocaleString('pt-BR',{minimumFractionDigits:2})}].map((row,j)=>(<div key={j} style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>{row.l}</span><span style={{fontSize:'11px',fontWeight:600,color:'#E8EAF0',...mono}}>{row.v}</span></div>))}\n" +
  "            <div style={{ height: '1px', background: '#252836', margin: '8px 0' }} />\n" +
  "            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>Al\u00EDquota efetiva</span><span style={{fontSize:'14px',fontWeight:700,color:'#34D399',...mono}}>{(emp.aliqEfetiva*100).toFixed(2).replace('.',',')}%</span></div>\n" +
  "            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>ICMS aproveit\u00E1vel</span><span style={{fontSize:'14px',fontWeight:700,color:emp.cor,...mono}}>{(emp.icms*100).toFixed(2).replace('.',',')}%</span></div>\n" +
  "          </div>\n" +
  "        ))}\n" +
  "      </div>";

if (snStart !== -1 && closingPos !== -1) {
  c = c.slice(0, snStart) + novoUI + '\n' + c.slice(closingPos);
  fs.writeFileSync(p, c, 'utf8');
  console.log('OK - linhas:', c.split('\n').length);
} else {
  console.log('FALHOU snStart:', snStart, 'closingPos:', closingPos);
}
