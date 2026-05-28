const fs = require('fs');

// 1. Backend - adicionar PUT /feriados/{fid}
const pb = 'C:/projetos/controle-fiscal/backend/app/routers/funcionarios.py';
let b = fs.readFileSync(pb, 'utf8');

const putFeriado =
  "\n@router.put(\"/feriados/{fid}\")\n" +
  "def atualizar_feriado(fid: int, dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):\n" +
  "    f = db.query(Feriado).filter(Feriado.id == fid).first()\n" +
  "    if not f: raise HTTPException(404, \"Nao encontrado\")\n" +
  "    for k, v in dados.items():\n" +
  "        if k not in ('id', 'ativo'): setattr(f, k, v)\n" +
  "    db.commit(); db.refresh(f)\n" +
  "    return f\n";

b = b + putFeriado;
fs.writeFileSync(pb, b, 'utf8');
console.log('Backend OK');

// 2. Frontend - adicionar estado editandoFeriado e botao editar
const pf = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(pf, 'utf8').replace(/\r\n/g, '\n');

// Adicionar estado editandoFeriado
c = c.split(
  "const [formFeriado, setFormFeriado] = useState({dia:'1',mes:'1',descricao:'',tipo:'nacional'})"
).join(
  "const [formFeriado, setFormFeriado] = useState({dia:'1',mes:'1',descricao:'',tipo:'nacional'})\n" +
  "  const [editandoFeriado, setEditandoFeriado] = useState<number|null>(null)"
);

// Atualizar salvarFeriado para suportar PUT
c = c.replace(
  /const salvarFeriado = async \(\) => \{\s*\n\s*if \(!formFeriado\.descricao\.trim\(\)\) return\s*\n\s*const payload = \{ dia: parseInt\(formFeriado\.dia\), mes: parseInt\(formFeriado\.mes\), descricao: formFeriado\.descricao, tipo: formFeriado\.tipo \}\s*\n\s*await fetch\(API \+ '\/funcionarios\/feriados\/', \{ method: 'POST', headers: hdr\(\), body: JSON\.stringify\(payload\) \}\)\s*\n\s*setFormFeriado\(\{ dia: '1', mes: '1', descricao: '', tipo: 'nacional' \}\)\s*\n\s*showNotif\('Feriado salvo!'\)\s*\n\s*await carregar\(\)\s*\n\s*\}/,
  "const salvarFeriado = async () => {\n" +
  "    if (!formFeriado.descricao.trim()) return\n" +
  "    const payload = { dia: parseInt(formFeriado.dia), mes: parseInt(formFeriado.mes), descricao: formFeriado.descricao, tipo: formFeriado.tipo }\n" +
  "    if (editandoFeriado) {\n" +
  "      await fetch(API + '/funcionarios/feriados/' + editandoFeriado, { method: 'PUT', headers: hdr(), body: JSON.stringify(payload) })\n" +
  "    } else {\n" +
  "      await fetch(API + '/funcionarios/feriados/', { method: 'POST', headers: hdr(), body: JSON.stringify(payload) })\n" +
  "    }\n" +
  "    setFormFeriado({ dia: '1', mes: '1', descricao: '', tipo: 'nacional' })\n" +
  "    setEditandoFeriado(null)\n" +
  "    showNotif(editandoFeriado ? 'Feriado atualizado!' : 'Feriado salvo!')\n" +
  "    await carregar()\n" +
  "  }"
);

// Atualizar titulo do formulario para mostrar modo edicao
c = c.split(
  ">\u2795 Adicionar Feriado<"
).join(
  ">{editandoFeriado ? '\u270F\uFE0F Editando Feriado' : '\u2795 Adicionar Feriado'}<"
);

// Atualizar botao salvar
c = c.split(
  ">\uD83D\uDCBE Salvar Feriado<"
).join(
  ">{editandoFeriado ? '\uD83D\uDCBE Salvar Altera\u00E7\u00F5es' : '\uD83D\uDCBE Salvar Feriado'}<"
);

// Adicionar botao cancelar edicao
c = c.split(
  ">\uD83D\uDCBE Salvar Feriado</button>\n" +
  "            <div style={{marginTop:16"
).join(
  ">{editandoFeriado ? '\uD83D\uDCBE Salvar Altera\u00E7\u00F5es' : '\uD83D\uDCBE Salvar Feriado'}</button>\n" +
  "            {editandoFeriado && <button onClick={()=>{setEditandoFeriado(null);setFormFeriado({dia:'1',mes:'1',descricao:'',tipo:'nacional'})}} style={{background:'transparent',border:'1px solid #2A2D3E',borderRadius:6,color:'#7B82A0',padding:'8px 20px',fontSize:13,fontWeight:600,cursor:'pointer',width:'100%',marginTop:6}}>Cancelar</button>}\n" +
  "            <div style={{marginTop:16"
);

// Adicionar botao editar na lista de feriados
c = c.split(
  "<button onClick={()=>excluirFeriado(f.id)} style={{background:'transparent',border:'1px solid #F8717144',borderRadius:4,color:'#F87171',padding:'4px 8px',fontSize:11,cursor:'pointer'}}>\u2715</button>"
).join(
  "<button onClick={()=>{setEditandoFeriado(f.id);setFormFeriado({dia:String(f.dia),mes:String(f.mes),descricao:f.descricao,tipo:f.tipo})}} style={{background:'transparent',border:'1px solid #4F8EF744',borderRadius:4,color:'#4F8EF7',padding:'4px 8px',fontSize:11,cursor:'pointer',marginRight:4}}>\u270F\uFE0F</button>" +
  "<button onClick={()=>excluirFeriado(f.id)} style={{background:'transparent',border:'1px solid #F8717144',borderRadius:4,color:'#F87171',padding:'4px 8px',fontSize:11,cursor:'pointer'}}>\u2715</button>"
);

fs.writeFileSync(pf, c, 'utf8');
console.log('Frontend OK');
