FROM python:3.12-alpine

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

EXPOSE 9000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000"]
