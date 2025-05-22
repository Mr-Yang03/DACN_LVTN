
# Smart Traffic Management System

![Traffic Management System](https://img.shields.io/badge/Status-Development-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🔭 Overview

This Traffic Management System is a comprehensive microservice-based platform for monitoring, analyzing, and managing urban traffic data. The system provides real-time traffic status, camera management, user feedback collection, news distribution, and AI-powered chat assistance to both users and administrators.

The platform is designed to help city authorities, traffic management departments, and citizens make informed decisions based on accurate traffic data, facilitating smoother traffic flow and enhanced urban mobility.

## 🏗️ System Architecture
![image](https://github.com/user-attachments/assets/ac48b191-8b10-4f4d-97de-5ac4c5936416)

This application follows a microservice architecture pattern, with the following components:

1. **Gateway API** - Central entry point that routes requests to appropriate services
2. **User Interfaces**:
   - User UI - Frontend for general users
   - Admin UI - Frontend for administrators
3. **Backend Services**:
   - Auth Service - Handles authentication and user management
   - Traffic Service - Processes real-time traffic data
   - Feedback Service - Manages user feedback and reports
   - News Service - Delivers traffic-related news and updates
   - Camera Service - Manages traffic cameras and video feeds
   - Userboard Service - Provides user management for admins
4. **AI Components**:
   - Velocity Estimation Model - AI model for traffic speed estimation
   - User Support Chatbot - Intelligent assistant for user queries

## ✨ Features

### For Users
- **Real-time Traffic Monitoring** - View traffic status on interactive maps
- **Traffic Camera Access** - Access traffic camera feeds with speed and vehicle type analytics
- **Feedback Submission** - Report traffic incidents, road damage, or issues
- **News & Updates** - Access latest traffic news and announcements
- **AI Chat Assistant** - Get intelligent responses to traffic-related queries

### For Administrators
- **Comprehensive Dashboard** - Monitor all system components
- **User Management** - Manage user accounts and permissions
- **Camera Management** - Configure and position traffic cameras
- **Content Management** - Create and publish traffic news
- **Feedback Analysis** - Review and respond to user feedback
- **Advanced Analytics** - Analyze traffic patterns and trends

## 📷 Feature Screenshots
### Home page
![image](https://github.com/user-attachments/assets/410db7bb-bb3a-4d13-981c-4e1a7187b30c)

###  Velocity Estimation
![gif_estimation_speed](https://github.com/user-attachments/assets/12d9bc09-c0c8-4438-920c-167bffbbac97)

### Chatbot


https://github.com/user-attachments/assets/f62b384d-872f-4852-b904-6f8c00a2175b




## 🔧 Technologies Used

### Backend
- **FastAPI** - High-performance API framework
- **Redis** - Caching and rate limiting

### Database
- **MongoDB** - NoSQL database for flexible data storage

### Frontend
- **Next.js** - React framework for UI development
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

### AI & Machine Learning
- **YOLOv8** – Real-time vehicle detection and tracking for speed estimation
- **DeepLabV3** – Semantic segmentation model used for lane detection
- **LangChain** – Framework powering RAG-based chatbot assistants for user and admin support

### DevOps
- **Docker Compose** - Multi-container orchestration
- **Azure** – Cloud platform for deployment
  
## 🚀 Installation and Setup

### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm
- Docker and Docker Compose
- Redis

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd DACN_LVTN
   ```

2. **Set up the environment variables**:
   Create a `.env` file in the root directory:
   ```
   HOST_IP=localhost
   ```

3. **Set up backend services**:
   For each service in the `backend` directory:
   ```bash
   cd backend/<service_name>
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   cd ../..
   ```

4. **Set up the Gateway API**:
   ```bash
   cd gatewayAPI
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

5. **Set up frontend applications**:
   ```bash
   cd user_ui
   npm install
   cd ../admin_ui
   npm install
   cd ..
   ```

6. **Set up Redis**:
   ```bash
   docker run -d -p 6379:6379 redis
   ```

7. **Start all services**:
   ```bash
   ./start.bat
   ```

### Docker Deployment

1. **Build and deploy all containers**:
   ```bash
   ./create_containers.bat
   ```

2. **Pull existing images**:
   ```bash
   ./pull_images.bat
   ```

3. **Push updated images**:
   ```bash
   ./push_images.bat
   ```

4. **Remove containers**:
   ```bash
   ./delete_containers.bat
   ```

5. **Deploy RAG service**:
   ```bash
   cd RAG
   docker build -t rag-agent .
   docker compose up -d
   cd ..
   ```
