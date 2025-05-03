# FROM rag-agent:latest
FROM python:3.11-alpine

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

EXPOSE 8005
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8005"]
