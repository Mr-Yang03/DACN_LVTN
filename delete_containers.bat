@echo off

echo Removing backend/auth_service
cd backend/auth_service
start cmd /c "docker-compose down"
cd ../..

echo Removing backend/traffic_service
cd backend/traffic_service
start cmd /c "docker-compose down"
cd ../..

echo Removing backend/feedback_service
cd backend/feedback_service
start cmd /c "docker-compose down"
cd ../..

echo Removing backend/news_service
cd backend/news_service
start cmd /c "docker-compose down"
cd ../..

echo Removing backend/camera_service
cd backend/camera_service
start cmd /c "docker-compose down"
cd ../..

echo Removing backend/userboard_service
cd backend/userboard_service
start cmd /c "docker-compose down"
cd ../..

echo Removing agent
cd Agent
start cmd /c "docker-compose down"
cd ..

echo Removing API Gateway...
cd gatewayAPI
start cmd /c "docker-compose down"
cd ..


echo.
echo All services removed in new terminals.
pause
