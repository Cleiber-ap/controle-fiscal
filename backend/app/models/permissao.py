from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Permissao(Base):
    __tablename__ = "permissoes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    modulo = Column(String(50), nullable=False)
    visualizar = Column(Boolean, default=False)
    editar = Column(Boolean, default=False)
    incluir = Column(Boolean, default=False)
    apagar = Column(Boolean, default=False)

    usuario = relationship("Usuario", back_populates="permissoes")