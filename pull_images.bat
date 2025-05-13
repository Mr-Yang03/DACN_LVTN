@echo off
echo Starting Docker image pull process...

REM Set your Docker Hub username
set DOCKER_USERNAME=phuctran2703

REM Login to Docker Hub
echo Logging in to Docker Hub...
docker login

REM Pull userboard_service
echo Pulling userboard_service...
docker pull %DOCKER_USERNAME%/userboard_service:latest
docker tag %DOCKER_USERNAME%/userboard_service:latest userboard_service:latest

REM Pull auth_service
echo Pulling auth_service...
docker pull %DOCKER_USERNAME%/auth_service:latest
docker tag %DOCKER_USERNAME%/auth_service:latest auth_service:latest

REM Pull camera_service
echo Pulling camera_service...
docker pull %DOCKER_USERNAME%/camera_service:latest
docker tag %DOCKER_USERNAME%/camera_service:latest camera_service:latest

REM Pull feedback_service
echo Pulling feedback_service...
docker pull %DOCKER_USERNAME%/feedback_service:latest
docker tag %DOCKER_USERNAME%/feedback_service:latest feedback_service:latest

REM Pull news_service
echo Pulling news_service...
docker pull %DOCKER_USERNAME%/news_service:latest
docker tag %DOCKER_USERNAME%/news_service:latest news_service:latest

REM Pull traffic_service
echo Pulling traffic_service...
docker pull %DOCKER_USERNAME%/traffic_service:latest
docker tag %DOCKER_USERNAME%/traffic_service:latest traffic_service:latest

REM Pull redis (if it's a custom image)
echo Pulling redis...
docker pull %DOCKER_USERNAME%/redis:alpine
docker tag %DOCKER_USERNAME%/redis:alpine redis:alpine

REM Pull traffic_agent
echo Pulling traffic_agent...
docker pull %DOCKER_USERNAME%/traffic_agent:latest
docker tag %DOCKER_USERNAME%/traffic_agent:latest traffic_agent:latest

REM Pull gatewayAPI
echo Pulling gatewayapi...
docker pull %DOCKER_USERNAME%/gatewayapi:latest
docker tag %DOCKER_USERNAME%/gatewayapi:latest gatewayapi:latest

echo All images have been pulled successfully!
pause
