from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import funcionarios, auth, empresas, usuarios
from app.routers.historico import router as historico_router
from app.routers.notas import router as notas_router, NotaFiscal
from app.routers.auditoria import router as auditoria_router, LogAuditoria

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Controle Fiscal API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://controle-fiscal-wine.vercel.app", "https://*.vercel.app", "https://controle-fiscal-vdxk.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(empresas.router, prefix="/empresas", tags=["Empresas"])
app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuários"])
app.include_router(historico_router, prefix="/dados", tags=["Dados"])
app.include_router(notas_router, prefix="/notas", tags=["Notas"])
app.include_router(funcionarios.router, prefix="/funcionarios", tags=["Funcionarios"])
app.include_router(auditoria_router, prefix="/auditoria", tags=["Auditoria"])

@app.get("/")
def root():
    return {"status": "ok"}
