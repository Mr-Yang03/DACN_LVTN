from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from connection import get_database
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

auth_router = APIRouter()

db = get_database()
user_collection = db["user"]


class LoginInfo(BaseModel):
    email: str
    password: str

class RegisterInfo(BaseModel):
    fullname: str
    email: str
    password: str

@auth_router.post("/register")
async def register_user(register_info: RegisterInfo) -> dict:
    if user_collection.find_one({"email": register_info.email}):
        raise HTTPException(status_code=400, detail="Email đã tồn tại")

    hashed_pw = pwd_context.hash(register_info.password)
    new_user = {
        "fullname": register_info.fullname,
        "email": register_info.email,
        "password": hashed_pw
    }
    user_collection.insert_one(new_user)
    return {"email": register_info.email}

@auth_router.post("/login")
async def check_login(login_info: LoginInfo) -> dict:
    check_user = user_collection.find_one({"email": login_info.email})

    if not check_user or not pwd_context.verify(login_info.password, check_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_data = {
        "fullname": check_user["fullname"],
        "email": check_user["email"]
    }
    return user_data