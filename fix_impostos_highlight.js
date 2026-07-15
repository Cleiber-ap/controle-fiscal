const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImpostosPagos/index.tsx', 'utf8');

// Remover destaque amarelo do ano atual
c = c.replace(
  "fontWeight:d.ano===anoAtual?700:600,color:d.ano===anoAtual?'#FBBF24':'#E8EAF0'",
  "fontWeight:600,color:'#E8EAF0'"
);
c = c.replace(
  "{d.ano}{d.ano===anoAtual&&<span style={{fontSize:9,background:'rgba(251,191,36,0.15)',color:'#FBBF24',padding:'1px 5px',borderRadius:999,marginLeft:6}}>atual</span>}",
  "{d.ano}"
);

// Remover destaque amarelo do mês anterior
c = c.replace(
  "style={{background:isMesAnt(r.ano,r.mes)?'rgba(251,191,36,0.06)':''}}",
  "style={{}}"
);
c = c.replace(
  "color:isMesAnt(r.ano,r.mes)?'#FBBF24':'#7B82A0',fontWeight:isMesAnt(r.ano,r.mes)?700:400",
  "color:'#7B82A0',fontWeight:400"
);
c = c.replace(
  "{isMesAnt(r.ano,r.mes)&&<span style={{fontSize:9,background:'rgba(251,191,36,0.15)',color:'#FBBF24',padding:'1px 5px',borderRadius:999,marginLeft:5}}>ant.</span>}",
  ""
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImpostosPagos/index.tsx', c, 'utf8');
console.log('OK');
