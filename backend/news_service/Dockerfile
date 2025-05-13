FROM python:3.12-alpine

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

EXPOSE 8004

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8004"]
