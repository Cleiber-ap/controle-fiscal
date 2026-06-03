FROM python:3.13-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
ENV DB_HOST=aws-0-sa-east-1.pooler.supabase.com
ENV DB_PORT=6543
ENV DB_USER=postgres.rbabrsalynwduxykzblz
ENV DB_PASSWORD=Fiscal@2026#CF
ENV DB_NAME=postgres
ENV DB_SSLMODE=require
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]