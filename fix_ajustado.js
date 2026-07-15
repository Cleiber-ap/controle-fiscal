const fs = require('fs');

// 1. Fix backend - adicionar campo ajustado no model e endpoint
let b = fs.readFileSync('C:/projetos/controle-fiscal/backend/app/routers/notas.py', 'utf8');

// Adicionar campo no model NotaFiscal
b = b.replace(
  "    mes_lancamento = Column(String(10), nullable=True)\n\nrouter = APIRouter()",
  "    mes_lancamento = Column(String(10), nullable=True)\n    ajustado = Column(Boolean, default=False, nullable=True)\n\nrouter = APIRouter()"
);

// Adicionar Boolean no import do sqlalchemy
b = b.replace(
  "from sqlalchemy import Column, Integer, String, Float, ForeignKey",
  "from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean"
);

// Adicionar ajustado no retorno do listar_notas
b = b.replace(
  '        "mes_lancamento": n.mes_lancamento,\n        "nat_operacao": n.nat_operacao,\n    } for n in notas]',
  '        "mes_lancamento": n.mes_lancamento,\n        "nat_operacao": n.nat_operacao,\n        "ajustado": n.ajustado or False,\n    } for n in notas]'
);

// Adicionar endpoint PUT /notas/ajustado/{nota_id}
const novoEndpoint = `
@router.put("/ajustado/{nota_id}")
def atualizar_ajustado(nota_id: int, dados: dict, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    nota = db.query(NotaFiscal).filter(NotaFiscal.id == nota_id).first()
    if not nota:
        return {"error": "Nota nao encontrada"}
    nota.ajustado = dados.get("ajustado", False)
    db.commit()
    return {"message": "OK", "ajustado": nota.ajustado}
`;

b = b + novoEndpoint;

fs.writeFileSync('C:/projetos/controle-fiscal/backend/app/routers/notas.py', b, 'utf8');
console.log('OK backend');

// 2. Fix frontend Contabilidade - adicionar coluna Ajuste
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Adicionar Ajuste no header da tabela após Imposto
c = c.replace(
  "'Dt. Pagto','Imposto','Status',''",
  "'Dt. Pagto','Imposto','Ajuste','Status',''"
);

// Adicionar td Ajuste na linha original após a td de imposto
// Localizar pelo trecho único da td de imposto
const tdImpostoEnd = "return <span style={{ color: '#4A5070' }}>—</span>\n                          })()}\n                        </td>";
const tdAjuste = `return <span style={{ color: '#4A5070' }}>—</span>
                          })()}
                        </td>
                        <td style={tdBase({ textAlign: 'center' })}>
                          <input type="checkbox" checked={r.ajustado || false}
                            onChange={async (e) => {
                              await api.put('/notas/ajustado/' + r.id, { ajustado: e.target.checked })
                              await carregarTudo()
                            }}
                            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#34D399' }} />
                        </td>`;

if (!c.includes(tdImpostoEnd)) { console.log('NAO ENCONTRADO: td imposto end'); process.exit(1); }
c = c.replace(tdImpostoEnd, tdAjuste);

// Adicionar td vazia na linha parcial após imposto
const tdImpostoParcial = "return <span style={{ color: '#4A5070' }}>—</span>\n                                                  })()}\n                                              </td>";
if (c.includes(tdImpostoParcial)) {
  c = c.replace(tdImpostoParcial, 
    "return <span style={{ color: '#4A5070' }}>—</span>\n                                                  })()}\n                                              </td>\n                              <td style={tdSm()}></td>"
  );
}

// Adicionar td vazia no tfoot
c = c.replace(
  "<td></td><td></td><td></td><td></td><td></td>",
  "<td></td><td></td><td></td><td></td><td></td><td></td>"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK frontend');
