from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Connect MongoDB using environment variable for security
MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client["traffic-monitor"]
user_collection = db["user"]

# FastAPI
app = FastAPI()

class User(BaseModel):
    username: str
    password: str

@app.post("/login")
async def check_login(user : User):
    check_user = user_collection.find_one({"username": user.username, "password": user.password})

    if not check_user:
        return {"success": False}
    
    return {"success": True}