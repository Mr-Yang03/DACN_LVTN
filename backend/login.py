from fastapi import APIRouter
from pymongo import MongoClient
from pydantic import BaseModel
import os

login_router = APIRouter()

# Connect MongoDB using environment variable for security
MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client["traffic-monitor"]
user_collection = db["user"]

class LoginInfo(BaseModel):
    email: str
    password: str

@login_router.post('/login')
async def check_login(login_info : LoginInfo) -> dict:
    check_user = user_collection.find_one({"email": login_info.email, "password": login_info.password})

    if not check_user:
        return {"success": False}
    
    return {"success": True}