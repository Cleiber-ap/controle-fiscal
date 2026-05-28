from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    perfil = Column(String(50))
    ativo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    permissoes = relationship("Permissao", back_populates="usuario", cascade="all, delete")