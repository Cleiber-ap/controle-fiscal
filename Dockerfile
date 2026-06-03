FROM python:3.13-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
CMD sh -c "echo DB_HOST=$DB_HOST && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"