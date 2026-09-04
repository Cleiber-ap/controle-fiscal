from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import funcionarios, auth, empresas, usuarios
from app.routers.historico import router as historico_router
from app.routers.notas import router as notas_router, NotaFiscal
from app.routers.auditoria import router as auditoria_router, LogAuditoria
Base.metadata.create_all(bind=engine)

# create_all cria tabelas novas, mas nao acrescenta colunas em tabela que ja
# existe. Como o projeto nao usa Alembic, colunas novas entram aqui — sempre
# com IF NOT EXISTS, para o startup poder repetir sem efeito.
_COLUNAS_NOVAS = [
    "ALTER TABLE encargos_horas_extras ADD COLUMN IF NOT EXISTS mult_he DOUBLE PRECISION DEFAULT 1.5",
    "ALTER TABLE encargos_horas_extras ADD COLUMN IF NOT EXISTS faltas DOUBLE PRECISION DEFAULT 0",
    "ALTER TABLE encargos_fechamento ADD COLUMN IF NOT EXISTS detalhe TEXT",
    "ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS data_admissao VARCHAR(10)",
    "ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS data_demissao VARCHAR(10)",
    # Sugestao inicial de admissao: a data em que o registro foi cadastrado. So
    # preenche o que esta vazio, entao repetir nao sobrescreve correcao manual.
    "UPDATE funcionarios SET data_admissao = TO_CHAR(created_at, 'YYYY-MM-DD') "
    "WHERE data_admissao IS NULL AND created_at IS NOT NULL",
    # Primeira vigencia de cada funcionario: a remuneracao atual, valendo desde a
    # admissao. NOT EXISTS deixa a instrucao repetivel e nao mexe em quem ja tem
    # historico.
    "INSERT INTO funcionario_salarios "
    "(funcionario_id, vigencia, salario_base, vale_alimentacao, salario_dinheiro, "
    " vale_transporte, vale_transporte_valor) "
    "SELECT f.id, COALESCE(f.data_admissao, TO_CHAR(f.created_at, 'YYYY-MM-DD'), '2000-01-01'), "
    "       f.salario_base, f.vale_alimentacao, f.salario_dinheiro, "
    "       f.vale_transporte, f.vale_transporte_valor "
    "FROM funcionarios f "
    "WHERE NOT EXISTS (SELECT 1 FROM funcionario_salarios s WHERE s.funcionario_id = f.id)",
]

def _aplicar_colunas_novas():
    from sqlalchemy import text
    with engine.begin() as conn:
        for ddl in _COLUNAS_NOVAS:
            try:
                conn.execute(text(ddl))
            except Exception as e:  # nao derruba a API por causa de migracao
                print("migracao ignorada:", ddl, "->", e)

_aplicar_colunas_novas()
app = FastAPI(title="Controle Fiscal API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://controle-fiscal-vdxk.vercel.app", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(empresas.router, prefix="/empresas", tags=["Empresas"])
app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(historico_router, prefix="/dados", tags=["Dados"])
app.include_router(notas_router, prefix="/notas", tags=["Notas"])
app.include_router(funcionarios.router, prefix="/funcionarios", tags=["Funcionarios"])
app.include_router(auditoria_router, prefix="/auditoria", tags=["Auditoria"])
@app.get("/")
def root():
    return {"status": "ok"}