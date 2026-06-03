FROM python:3.13-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
ENV DATABASE_URL=postgresql://postgres:lissZetCGXvTRaDHsPdQVpxlSDEHlFdx@postgres.railway.internal:5432/railway
ENV SECRET_KEY=controle-fiscal-chave-secreta-muito-longa-2026
ENV ALGORITHM=HS256
ENV ACCESS_TOKEN_EXPIRE_MINUTES=99999
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]