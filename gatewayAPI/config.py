import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get HOST_IP from environment variable, default to localhost if not set
HOST_IP = os.getenv("HOST_IP", "localhost")

SERVICES = {
    "users": f"http://{HOST_IP}:8001",
    "traffic": f"http://{HOST_IP}:8002",
    "feedback": f"http://{HOST_IP}:8003",
    "news": f"http://{HOST_IP}:8004",
    "agent": f"http://{HOST_IP}:8005",
    "camera": f"http://{HOST_IP}:8006",
}