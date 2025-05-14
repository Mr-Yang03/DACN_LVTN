@echo off

echo Starting backend/auth_service
cd backend/auth_service
start cmd /c "docker-compose up -d"
cd ../..

echo Starting backend/traffic_service
cd backend/traffic_service
start cmd /c "docker-compose up -d"
cd ../..

echo Starting backend/feedback_service
cd backend/feedback_service
start cmd /c "docker-compose up -d"
cd ../..

echo Starting backend/news_service
cd backend/news_service
start cmd /c "docker-compose up -d"
cd ../..

echo Starting backend/camera_service
cd backend/camera_service
start cmd /c "docker-compose up -d"
cd ../..

echo Starting backend/userboard_service
cd backend/userboard_service
start cmd /c "docker-compose up -d"
cd ../..

echo Starting agent
cd Agent
start cmd /c "docker-compose up -d"
cd ..

echo Starting API Gateway...
cd gatewayAPI
start cmd /c "docker-compose up -d"
cd ..


echo.
echo All services started in new terminals.
pause
