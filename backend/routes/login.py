from fastapi import APIRouter
from pydantic import BaseModel
from database.connection import get_database

login_router = APIRouter()

db = get_database()
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