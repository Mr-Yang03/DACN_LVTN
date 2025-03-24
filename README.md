
Run FastAPI backend in /backend directory:
```Text
    python -m venv .venv 
    .venv/Scripts/activate 
    pip install -r requirements.txt
    uvicorn auth_service.main:app --host 0.0.0.0 --port 8001 --reload
```
Run frontend in /frontend directory:
```Text
    npm i
    npm run dev
```
Run gateway API in /gatewayAPI directory:
1. Tải docker và cấu hình redis bằng cách chạy lệnh sau trong cmd: docker run -d -p 6379:6379 redis
2. Chạy Gateway API:
```text
    python -m venv .venv 
    .venv/Scripts/activate 
    pip install -r requirements.txt
    uvicorn main:app --host 0.0.0.0 --port 9000 --reload
```
