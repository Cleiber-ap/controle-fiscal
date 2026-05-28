const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Adicionar feriadosFixosMes antes de calculos
const fixosCode =
  "  const _pasc = calcPascoa(mesRef.ano)\n" +
  "  const _add = (d:Date,n:number)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r}\n" +
  "  const feriadosFixosMes = [\n" +
  "    {dia:1,mes:1,descricao:'Confraterniza\u00E7\u00E3o Universal',tipo:'nacional'},\n" +
  "    {dia:25,mes:1,descricao:'Anivers\u00E1rio de S\u00E3o Paulo',tipo:'estadual'},\n" +
  "    {dia:21,mes:4,descricao:'Tiradentes',tipo:'nacional'},\n" +
  "    {dia:1,mes:5,descricao:'Dia do Trabalho',tipo:'nacional'},\n" +
  "    {dia:9,mes:7,descricao:'Revolu\u00E7\u00E3o Constitucionalista',tipo:'estadual'},\n" +
  "    {dia:7,mes:9,descricao:'Independ\u00EAncia do Brasil',tipo:'nacional'},\n" +
  "    {dia:12,mes:10,descricao:'Nossa Sra. Aparecida',tipo:'nacional'},\n" +
  "    {dia:2,mes:11,descricao:'Finados',tipo:'nacional'},\n" +
  "    {dia:15,mes:11,descricao:'Proclama\u00E7\u00E3o da Rep\u00FAblica',tipo:'nacional'},\n" +
  "    {dia:25,mes:12,descricao:'Natal',tipo:'nacional'},\n" +
  "    {dia:_add(_pasc,-48).getDate(),mes:_add(_pasc,-48).getMonth()+1,descricao:'Carnaval (2\u00AA)',tipo:'nacional'},\n" +
  "    {dia:_add(_pasc,-47).getDate(),mes:_add(_pasc,-47).getMonth()+1,descricao:'Carnaval (3\u00AA)',tipo:'nacional'},\n" +
  "    {dia:_add(_pasc,-2).getDate(),mes:_add(_pasc,-2).getMonth()+1,descricao:'Sexta-Feira Santa',tipo:'nacional'},\n" +
  "    {dia:_add(_pasc,60).getDate(),mes:_add(_pasc,60).getMonth()+1,descricao:'Corpus Christi',tipo:'nacional'},\n" +
  "  ].filter((f:any)=>f.mes===mesRef.mes).sort((a:any,b:any)=>a.dia-b.dia)\n";

c = c.split("  const calculos = funcionarios.map").join(fixosCode + "  const calculos = funcionarios.map");

// 2. Atualizar contador do painel
c = c.split(">({feriadosCustom.length} registros)<").join(
  ">({feriadosFixosMes.length + feriadosCustom.length} no m\u00EAs, {feriadosCustom.length} personalizados)<"
);

// 3. Substituir lista por versao combinada
const listaAntiga = "Nenhum feriado cadastrado.";
const listaFixos =
  "              {feriadosFixosMes.map((f:any,i:number)=>(\n" +
  "                <div key={'fx'+i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#0E101780',borderRadius:6,padding:'8px 12px',border:'1px solid #2A2D3E88',opacity:0.85}}>\n" +
  "                  <div style={{display:'flex',alignItems:'center',gap:10}}>\n" +
  "                    <span style={{fontSize:14}}>{f.tipo==='nacional'?'\uD83C\uDDE7\uD83C\uDDF7':'\uD83C\uDFDB\uFE0F'}</span>\n" +
  "                    <div>\n" +
  "                      <div style={{fontSize:13,fontWeight:600,color:'#A0A8C0'}}>{f.descricao}</div>\n" +
  "                      <div style={{fontSize:11,color:'#5A6080'}}>{String(f.dia).padStart(2,'0')}/{String(f.mes).padStart(2,'0')} \u00B7 <span style={{color:'#5A6080'}}>{f.tipo} \u00B7 fixo autom\u00E1tico</span></div>\n" +
  "                    </div>\n" +
  "                  </div>\n" +
  "                  <span style={{fontSize:10,color:'#5A6080',border:'1px solid #2A2D3E',borderRadius:4,padding:'2px 6px'}}>\uD83D\uDD12 fixo</span>\n" +
  "                </div>\n" +
  "              ))}\n" +
  "              {feriadosCustom.length===0 && feriadosFixosMes.length===0 && <div style={{textAlign:'center',color:'#7B82A0',fontSize:13,padding:'16px 0'}}>Nenhum feriado neste m\u00EAs.</div>}\n";

c = c.split("Nenhum feriado cadastrado.").join(
  "Nenhum feriado personalizado neste m\u00EAs."
);

// Inserir lista de fixos antes da lista de custom
c = c.split("{feriadosCustom.map((f:any)=>(").join(
  listaFixos + "{feriadosCustom.map((f:any)=>(\n"
);

// Remover o bloco "length === 0" que agora é redundante (substituído acima)
c = c.replace(
  /\{feriadosCustom\.length === 0 \? \([^)]*Nenhum feriado personalizado[^)]*\) : \(\s*<div style=\{\{display:'flex',flexDirection:'column',gap:6\}\}>/,
  "<div style={{display:'flex',flexDirection:'column',gap:6}}>"
);
c = c.replace(/\s*\)\s*\}\s*\n(\s*<\/div>\s*\n\s*\}\)\s*\}\s*\n\s*<\/div>)/, '\n$1');

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
