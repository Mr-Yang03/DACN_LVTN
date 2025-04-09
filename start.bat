@echo off

cd frontend
start cmd /k "npm run dev"
cd ..

echo Starting backend/auth_service
cd backend/auth_service
call .venv\Scripts\activate
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 8001 --reload"
cd ../..

echo Starting backend/traffic_service
cd backend/traffic_service
call .venv\Scripts\activate
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 8002 --reload"
cd ../..

echo 🔶 Starting API Gateway...
cd gatewayAPI
call .venv\Scripts\activate
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 9000 --reload"
cd ..

echo.
echo All services started in new terminals.
pause
