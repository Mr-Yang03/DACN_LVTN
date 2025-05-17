@echo off

echo Starting user_ui
cd user_ui
start cmd /k "npm run dev"
cd ..

echo Starting admin ui
cd admin_ui
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

echo Starting backend/feedback_service
cd backend/feedback_service
call .venv\Scripts\activate
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 8003 --reload"
cd ../..

echo Starting backend/news_service
cd backend/news_service
call .venv\Scripts\activate
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 8004 --reload"
cd ../..

echo Starting backend/camera_service
cd backend/camera_service
call .venv\Scripts\activate
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 8009 --reload"
cd ../..

echo Starting backend/userboard_service
cd backend/userboard_service
call .venv\Scripts\activate
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 8010 --reload"
cd ../..

echo Starting API Gateway...
cd gatewayAPI
call .venv\Scripts\activate
start cmd /k "uvicorn main:app --host 0.0.0.0 --port 9000 --reload"
cd ..

start cmd /c "docker run -d -p 6379:6379 redis"

echo.
echo All services started in new terminals.
pause
