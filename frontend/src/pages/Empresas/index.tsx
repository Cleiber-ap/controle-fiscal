import { useState, useEffect } from 'react'
import { empresasAPI } from '../../api/endpoints'
interface Empresa { id: number; nome: string; razao_social: string; aliquota_das: number; credito_icms: number; ativo: boolean }

export default function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<{nome:string,razao_social:string}>({nome:'',razao_social:''})
  const [editId, setEditId] = useState<number|null>(null)
  const [showForm, setShowForm] = useState(false)
  const [erro, setErro] = useState('')
  const [notif, setNotif] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try { const res = await empresasAPI.listar(); setEmpresas(res.data) }
    catch { setErro('Erro ao carregar') } finally { setLoading(false) }
  }

  function abrirNova() { setForm({nome:'',razao_social:''}); setEditId(null); setShowForm(true) }

  function abrirEditar(e: Empresa) { setForm({nome:e.nome,razao_social:e.razao_social}); setEditId(e.id); setShowForm(true) }

  async function salvar() {
    try {
      if (editId) { await empresasAPI.atualizar(editId, form); showNotif('Empresa atualizada!') }
      else { await empresasAPI.criar(form); showNotif('Empresa criada!') }
      setShowForm(false); carregar()
    } catch { setErro('Erro ao salvar') }
  }

  async function excluir(id: number) {
    if (!confirm('Excluir empresa?')) return
    try { await empresasAPI.excluir(id); showNotif('Empresa excluida!'); carregar() }
    catch { setErro('Erro ao excluir') }
  }

  function showNotif(msg: string) { setNotif(msg); setTimeout(() => setNotif(''), 3000) }

  const btn = (label: string, onClick: ()=>void, color='#4F8EF7', bg='rgba(79,142,247,0.12)') => (
    <button onClick={onClick} style={{padding:'5px 12px',borderRadius:6,border:'1px solid '+color,background:bg,color:color,fontSize:11,fontWeight:600,cursor:'pointer'}}>{label}</button>
  )

  return (
    <div style={{padding:'16px 24px',display:'flex',gap:16,alignItems:'flex-start'}}>
      <div style={{flex:1}}>
        <div style={{fontSize:12,color:'#7B82A0',marginBottom:4}}>
          <span>Inicio</span><span style={{margin:'0 4px',color:'#4A5070'}}>{'>'}</span><span style={{color:'#E8EAF0'}}>Empresas</span>
        </div>
        <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'1.2px',color:'#7B82A0',marginBottom:10,marginTop:8}}>Cadastro de Empresas</div>
        {notif&&<div style={{padding:'8px 14px',background:'rgba(52,211,153,0.12)',border:'1px solid #34D399',borderRadius:8,color:'#34D399',fontSize:12,marginBottom:12}}>{notif}</div>}
        {erro&&<div style={{padding:'8px 14px',background:'rgba(248,113,113,0.12)',border:'1px solid #F87171',borderRadius:8,color:'#F87171',fontSize:12,marginBottom:12}}>{erro}</div>}
        <div style={{background:'#13161F',border:'1px solid #252836',borderRadius:14,overflow:'hidden'}}>
          <div style={{padding:'10px 16px',background:'#1A1D2A',borderBottom:'1px solid #252836',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:12,fontWeight:600,color:'#E8EAF0'}}>{empresas.length} empresa(s) cadastrada(s)</span>
            {btn('+ Nova Empresa', abrirNova)}
          </div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{background:'#1A1D2A'}}>
              {['Nome','Razao Social','Acoes'].map((h,i)=>(
                <th key={h} style={{padding:'10px 16px',textAlign:i===2?'center':'left',fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',color:'#7B82A0',borderBottom:'1px solid #252836'}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading?<tr><td colSpan={3} style={{padding:24,textAlign:'center',color:'#7B82A0'}}>Carregando...</td></tr>
              :empresas.map(e=>(
                <tr key={e.id} style={{borderBottom:'1px solid #252836'}}>
                  <td style={{padding:'12px 16px',fontWeight:600,color:'#4F8EF7'}}>{e.nome}</td>
                  <td style={{padding:'12px 16px',color:'#E8EAF0'}}>{e.razao_social}</td>
                  <td style={{padding:'12px 16px',textAlign:'center',display:'flex',gap:6,justifyContent:'center'}}>
                    {btn('Editar', ()=>abrirEditar(e))}
                    <button onClick={()=>excluir(e.id)} style={{padding:'5px 8px',borderRadius:6,border:'1px solid #F87171',background:'rgba(248,113,113,0.12)',color:'#F87171',fontSize:12,fontWeight:700,cursor:'pointer'}}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm&&(
        <div style={{width:280,background:'#13161F',border:'1px solid #252836',borderRadius:14,padding:16,flexShrink:0}}>
          <div style={{fontSize:13,fontWeight:600,color:'#E8EAF0',marginBottom:14}}>{editId?'Editar Empresa':'Nova Empresa'}</div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',color:'#7B82A0',display:'block',marginBottom:5}}>Nome *</label>
            <input value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))}
              placeholder="Ex: SIX"
              style={{width:'100%',padding:'8px 10px',background:'#1A1D2A',border:'1px solid #333750',borderRadius:6,color:'#E8EAF0',fontSize:12,outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',color:'#7B82A0',display:'block',marginBottom:5}}>Razao Social *</label>
            <input value={form.razao_social} onChange={e=>setForm(f=>({...f,razao_social:e.target.value}))}
              placeholder="Ex: SIX Comercial Artigos Promocionais"
              style={{width:'100%',padding:'8px 10px',background:'#1A1D2A',border:'1px solid #333750',borderRadius:6,color:'#E8EAF0',fontSize:12,outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={salvar} style={{flex:1,padding:'8px',background:'#4F8EF7',border:'none',borderRadius:6,color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer'}}>Salvar</button>
            <button onClick={()=>setShowForm(false)} style={{padding:'8px 12px',background:'transparent',border:'1px solid #333750',borderRadius:6,color:'#7B82A0',fontSize:12,cursor:'pointer'}}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}