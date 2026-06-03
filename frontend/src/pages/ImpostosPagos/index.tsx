import { useEffect, useRef, useState } from 'react'
import { dasAPI } from '../../api/endpoints'

interface DasItem { id: number; empresa_id: number; ano: number; mes: number; valor: number }
const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
function fmtR(v: number) { return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }

export default function ImpostosPagos() {
  const [das, setDas] = useState<DasItem[]>([])
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const now = new Date()
  const mesAntIdx = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const anoAnt = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const anoAtual = now.getFullYear()

  useEffect(() => {
    Promise.all([
      dasAPI.listar(1).then((r: any) => r.data),
      dasAPI.listar(2).then((r: any) => r.data),
      dasAPI.listar(3).then((r: any) => r.data).catch(() => []),
    ]).then(([d1, d2, d3]: any) => setDas([...d1, ...d2, ...d3])
    ).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const dasSix   = das.filter(r => r.empresa_id === 1).sort((a,b) => b.ano !== a.ano ? b.ano-a.ano : b.mes-a.mes)
  const dasEnova = das.filter(r => r.empresa_id === 2).sort((a,b) => b.ano !== a.ano ? b.ano-a.ano : b.mes-a.mes)
  const dasCm    = das.filter(r => r.empresa_id === 3).sort((a,b) => b.ano !== a.ano ? b.ano-a.ano : b.mes-a.mes)
  const anosDisp = [...new Set(das.map(r => r.ano))].sort((a,b) => b-a)
  const totAnuais = anosDisp.map(ano => ({
    ano,
    six:   das.filter(r => r.empresa_id===1 && r.ano===ano).reduce((s,r) => s+r.valor, 0),
    enova: das.filter(r => r.empresa_id===2 && r.ano===ano).reduce((s,r) => s+r.valor, 0),
    cm:    das.filter(r => r.empresa_id===3 && r.ano===ano).reduce((s,r) => s+r.valor, 0),
  }))
  const grandTot = { six: totAnuais.reduce((s,d)=>s+d.six,0), enova: totAnuais.reduce((s,d)=>s+d.enova,0), cm: totAnuais.reduce((s,d)=>s+d.cm,0) }
  const isMesAnt = (ano: number, mes: number) => ano===anoAnt && mes===mesAntIdx+1

  useEffect(() => {
    if (loading) return
    const canvas = canvasRef.current; if (!canvas) return
    cancelAnimationFrame(animRef.current)
    canvas.width = canvas.offsetWidth; canvas.height = 220
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const anos = [...new Set(das.map(r=>r.ano))].sort((a,b)=>a-b); if (!anos.length) return
    const data = anos.map(ano => ({
      ano,
      six:   das.filter(r=>r.empresa_id===1&&r.ano===ano).reduce((s,r)=>s+r.valor,0),
      enova: das.filter(r=>r.empresa_id===2&&r.ano===ano).reduce((s,r)=>s+r.valor,0),
      cm:    das.filter(r=>r.empresa_id===3&&r.ano===ano).reduce((s,r)=>s+r.valor,0),
    }))
    const maxV = Math.max(...data.map(d=>d.six+d.enova+d.cm),1)*1.15
    const PAD={top:32,right:16,bottom:28,left:64}, W=canvas.width, H=canvas.height, cH=H-PAD.top-PAD.bottom
    const n=data.length, barW=Math.max(32,Math.min(56,Math.floor(560/n)-10)), gap=Math.max(8,Math.floor(560/n)-barW)
    const fmtV=(v:number)=>v>=1e6?'R$'+(v/1e6).toFixed(1)+'M':v>=1e3?'R$'+(v/1e3).toFixed(0)+'K':'R$'+v.toFixed(0)
    let prog=0; const ts0=performance.now()
    function draw(ts:number){
      prog=Math.min(1,(ts-ts0)/800); const ease=1-Math.pow(1-prog,3)
      ctx.clearRect(0,0,W,H); ctx.font='11px monospace'; ctx.textAlign='right'; ctx.fillStyle='#7B82A0'
      for(let i=0;i<=5;i++){
        const v=maxV*i/5,y=PAD.top+cH-(cH*i/5)
        ctx.strokeStyle=i===0?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.07)'; ctx.lineWidth=1
        ctx.beginPath(); ctx.moveTo(PAD.left,y); ctx.lineTo(W-PAD.right,y); ctx.stroke()
        if(i>0) ctx.fillText(fmtV(v),PAD.left-4,y+4)
      }
      data.forEach((d,i)=>{
        const x=PAD.left+i*(barW+gap); let yB=PAD.top+cH
        const hS=d.six/maxV*cH*ease; yB-=hS; ctx.fillStyle='#4F8EF7CC'; ctx.beginPath()
        if((ctx as any).roundRect)(ctx as any).roundRect(x,yB,barW,Math.max(0,hS),[0,0,2,2]); else ctx.rect(x,yB,barW,Math.max(0,hS)); ctx.fill()
        const hE=d.enova/maxV*cH*ease; yB-=hE; ctx.fillStyle='#34D399CC'; ctx.beginPath(); ctx.rect(x,yB,barW,Math.max(0,hE)); ctx.fill()
        const hC=d.cm/maxV*cH*ease; yB-=hC; ctx.fillStyle='#F472B6CC'; ctx.beginPath()
        if((ctx as any).roundRect)(ctx as any).roundRect(x,yB,barW,Math.max(0,hC),[2,2,0,0]); else ctx.rect(x,yB,barW,Math.max(0,hC)); ctx.fill()
        ctx.fillStyle='#7B82A0'; ctx.font='10px monospace'; ctx.textAlign='center'
        ctx.fillText(String(d.ano),x+barW/2,PAD.top+cH+16)
      })
      if(prog>=1) data.forEach((d,i)=>{
        const tot=d.six+d.enova+d.cm; if(!tot) return
        const x=PAD.left+i*(barW+gap), yT=PAD.top+cH-(tot/maxV*cH)
        ctx.save(); ctx.fillStyle='#E8EAF0'; ctx.font='bold 10px monospace'; ctx.textAlign='center'
        ctx.fillText(fmtV(tot),x+barW/2,Math.max(PAD.top+12,yT-5)); ctx.restore()
      })
      if(prog<1) animRef.current=requestAnimationFrame(draw)
    }
    animRef.current=requestAnimationFrame(draw)
    return ()=>cancelAnimationFrame(animRef.current)
  },[das,loading])

  if(loading) return <div style={{padding:32,color:'#7B82A0'}}>Carregando...</div>

  const cols=[{nome:'SIX',cor:'#4F8EF7',dados:dasSix},{nome:'ENOVA',cor:'#34D399',dados:dasEnova},{nome:'CM',cor:'#F472B6',dados:dasCm}]

  return (
    <div style={{padding:'16px 24px',maxWidth:1400}}>
      <div style={{fontSize:12,color:'#7B82A0',marginBottom:4}}>
        <span>Inicio</span><span style={{margin:'0 4px',color:'#4A5070'}}>{'>'}</span><span style={{color:'#A78BFA'}}>Impostos Pagos</span>
      </div>
      <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'1.2px',color:'#A78BFA',marginBottom:10,marginTop:8}}>Resumo Anual - Simples Nacional (DAS)</div>
      <div style={{background:'#13161F',border:'1px solid #252836',borderRadius:14,overflow:'hidden',marginBottom:16}}>
        <div style={{padding:'10px 16px',background:'#1A1D2A',borderBottom:'1px solid #252836',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:12,fontWeight:600,color:'#E8EAF0'}}>Imposto Pago por Ano</span>
          <div style={{display:'flex',gap:10,fontSize:10}}>
            {([{c:'#4F8EF7',l:'SIX'},{c:'#34D399',l:'ENOVA'}] as any[]).map(({c,l})=>(
              <span key={l} style={{display:'flex',alignItems:'center',gap:4}}>
                <span style={{width:7,height:7,borderRadius:1,background:c,display:'inline-block'}}></span>
                <span style={{color:'#7B82A0'}}>{l}</span>
              </span>
            ))}
          </div>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr style={{background:'#1A1D2A'}}>
            {([{h:'Ano',c:'#7B82A0'},{h:'SIX',c:'#4F8EF7'},{h:'ENOVA',c:'#34D399'},{h:'CM',c:'#F472B6'},{h:'Total',c:'#7B82A0'}] as any[]).map(({h,c},i)=>(
              <th key={h} style={{padding:'8px 16px',textAlign:i===0?'left':'right',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.8px',color:c,borderBottom:'1px solid #252836'}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {totAnuais.map(d=>(
              <tr key={d.ano} style={{background:d.ano===anoAtual?'rgba(251,191,36,0.04)':''}}>
                <td style={{padding:'8px 16px',borderBottom:'1px solid #252836',fontFamily:'JetBrains Mono,monospace',fontSize:12,fontWeight:d.ano===anoAtual?700:600,color:d.ano===anoAtual?'#FBBF24':'#E8EAF0',textAlign:'left'}}>
                  {d.ano}{d.ano===anoAtual&&<span style={{fontSize:9,background:'rgba(251,191,36,0.15)',color:'#FBBF24',padding:'1px 5px',borderRadius:999,marginLeft:6}}>atual</span>}
                </td>
                <td style={{padding:'8px 16px',borderBottom:'1px solid #252836',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#4F8EF7'}}>{d.six>0?fmtR(d.six):'--'}</td>
                <td style={{padding:'8px 16px',borderBottom:'1px solid #252836',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#34D399'}}>{d.enova>0?fmtR(d.enova):'--'}</td>
                <td style={{padding:'8px 16px',borderBottom:'1px solid #252836',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'#F472B6'}}>{d.cm>0?fmtR(d.cm):'--'}</td><td style={{padding:'8px 16px',borderBottom:'1px solid #252836',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:11,fontWeight:700,color:'#E8EAF0'}}>{fmtR(d.six+d.enova+d.cm)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr style={{background:'#1A1D2A'}}>
            <td style={{padding:'9px 16px',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'#7B82A0',borderTop:'2px solid #333750'}}>Total Geral</td>
            <td style={{padding:'9px 16px',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:11,fontWeight:700,color:'#4F8EF7',borderTop:'2px solid #333750'}}>{fmtR(grandTot.six)}</td>
            <td style={{padding:'9px 16px',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:11,fontWeight:700,color:'#34D399',borderTop:'2px solid #333750'}}>{fmtR(grandTot.enova)}</td>
            <td style={{padding:'9px 16px',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:11,fontWeight:700,color:'#F472B6',borderTop:'2px solid #333750'}}>{fmtR(grandTot.cm)}</td><td style={{padding:'9px 16px',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:12,fontWeight:700,color:'#E8EAF0',borderTop:'2px solid #333750'}}>{fmtR(grandTot.six+grandTot.enova+grandTot.cm)}</td>
          </tr></tfoot>
        </table>
      </div>
      <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'1.2px',color:'#A78BFA',marginBottom:10}}>Detalhe Mensal - DAS Pago</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16}}>
        {cols.map(({nome,cor,dados})=>(
          <div key={nome} style={{background:'#13161F',border:'1px solid #252836',borderRadius:14,overflow:'hidden'}}>
            <div style={{padding:'10px 16px',background:'#1A1D2A',borderBottom:'1px solid #252836',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:7}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:cor,display:'inline-block'}}></span>
                <span style={{fontSize:12,fontWeight:600,color:cor}}>{nome}</span>
              </div>
              <span style={{fontSize:10,color:'#7B82A0'}}>{dados.length} meses</span>
            </div>
            <div style={{overflowY:'auto',maxHeight:340}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead style={{position:'sticky',top:0,zIndex:1}}><tr style={{background:'#1A1D2A'}}>
                  <th style={{padding:'7px 14px',textAlign:'left',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.8px',color:'#7B82A0',borderBottom:'1px solid #252836'}}>Mes/Ano</th>
                  <th style={{padding:'7px 14px',textAlign:'right',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'.8px',color:'#FBBF24',borderBottom:'1px solid #252836'}}>DAS Pago</th>
                </tr></thead>
                <tbody>
                  {dados.length===0?(
                    <tr><td colSpan={2} style={{padding:'32px 14px',textAlign:'center',fontSize:11}}>
                      <div style={{fontSize:22,marginBottom:8}}>📭</div>
                      <div style={{fontWeight:600,color:'#7B82A0',marginBottom:4}}>Sem lancamentos</div>
                      <div style={{color:'#4A5070'}}>Dados serao inseridos em breve</div>
                    </td></tr>
                  ):dados.map(r=>(
                    <tr key={r.id} style={{background:isMesAnt(r.ano,r.mes)?'rgba(251,191,36,0.06)':''}}>
                      <td style={{padding:'7px 14px',borderBottom:'1px solid #252836',color:isMesAnt(r.ano,r.mes)?'#FBBF24':'#7B82A0',fontWeight:isMesAnt(r.ano,r.mes)?700:400}}>
                        {MESES[r.mes-1]}/{r.ano}
                        {isMesAnt(r.ano,r.mes)&&<span style={{fontSize:9,background:'rgba(251,191,36,0.15)',color:'#FBBF24',padding:'1px 5px',borderRadius:999,marginLeft:5}}>ant.</span>}
                      </td>
                      <td style={{padding:'7px 14px',borderBottom:'1px solid #252836',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:11,fontWeight:600,color:'#FBBF24'}}>{fmtR(r.valor)}</td>
                    </tr>
                  ))}
                </tbody>
                {dados.length>0&&<tfoot><tr style={{background:'#1A1D2A'}}>
                  <td style={{padding:'7px 14px',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'#7B82A0',borderTop:'1px solid #333750'}}>Total</td>
                  <td style={{padding:'7px 14px',textAlign:'right',fontFamily:'JetBrains Mono,monospace',fontSize:11,fontWeight:700,color:'#FBBF24',borderTop:'1px solid #333750'}}>{fmtR(dados.reduce((s,r)=>s+r.valor,0))}</td>
                </tr></tfoot>}
              </table>
            </div>
          </div>
        ))}
      </div>
      <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'1.2px',color:'#A78BFA',marginBottom:10}}>DAS Pago Anual - SIX + ENOVA</div>
      <div style={{background:'#13161F',border:'1px solid #252836',borderRadius:14,padding:'16px 16px 12px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <span style={{fontSize:12,color:'#7B82A0'}}>Total DAS pago por ano</span>
          <div style={{display:'flex',gap:12,fontSize:10}}>
            {([{c:'#4F8EF7',l:'SIX'},{c:'#34D399',l:'ENOVA'},{c:'#F472B6',l:'CM'}] as any[]).map(({c,l})=>(
              <span key={l} style={{display:'flex',alignItems:'center',gap:4}}>
                <span style={{width:8,height:8,borderRadius:1,background:c,display:'inline-block'}}></span>
                <span style={{color:'#7B82A0'}}>{l}</span>
              </span>
            ))}
          </div>
        </div>
        <canvas ref={canvasRef} style={{width:'100%',display:'block'}}></canvas>
      </div>
    </div>
  )
}
