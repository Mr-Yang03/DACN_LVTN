@echo off
echo Starting Docker image push process...

REM Set your Docker Hub username
set DOCKER_USERNAME=phuctran2703

REM Login to Docker Hub
echo Logging in to Docker Hub...
docker login

REM Push userboard_service
echo Pushing userboard_service...
docker tag userboard_service:latest %DOCKER_USERNAME%/userboard_service:latest
docker push %DOCKER_USERNAME%/userboard_service:latest

REM Push auth_service
echo Pushing auth_service...
docker tag auth_service:latest %DOCKER_USERNAME%/auth_service:latest
docker push %DOCKER_USERNAME%/auth_service:latest

REM Push camera_service
echo Pushing camera_service...
docker tag camera_service:latest %DOCKER_USERNAME%/camera_service:latest
docker push %DOCKER_USERNAME%/camera_service:latest

REM Push feedback_service
echo Pushing feedback_service...
docker tag feedback_service:latest %DOCKER_USERNAME%/feedback_service:latest
docker push %DOCKER_USERNAME%/feedback_service:latest

REM Push news_service
echo Pushing news_service...
docker tag news_service:latest %DOCKER_USERNAME%/news_service:latest
docker push %DOCKER_USERNAME%/news_service:latest

REM Push traffic_service
echo Pushing traffic_service...
docker tag traffic_service:latest %DOCKER_USERNAME%/traffic_service:latest
docker push %DOCKER_USERNAME%/traffic_service:latest

REM Push redis (if it's a custom image)
echo Pushing redis...
docker tag redis:alpine %DOCKER_USERNAME%/redis:alpine
docker push %DOCKER_USERNAME%/redis:alpine

REM Push traffic_agent
echo Pushing traffic_agent...
docker tag traffic_agent:latest %DOCKER_USERNAME%/traffic_agent:latest
docker push %DOCKER_USERNAME%/traffic_agent:latest

REM Push gatewayAPI
echo Pushing gatewayapi...
docker tag gatewayapi:latest %DOCKER_USERNAME%/gatewayapi:latest
docker push %DOCKER_USERNAME%/gatewayapi:latest

echo All images have been pushed successfully!
pause
