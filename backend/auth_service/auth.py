from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from connection import get_database
from passlib.context import CryptContext
from bson import ObjectId
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

auth_router = APIRouter()

db = get_database()
accounts_collection = db["accounts"]
users_collection = db["users"]


class LoginInfo(BaseModel):
    username: str
    password: str

class AccountInfo(BaseModel):
    username: str
    password: str
    account_type: str = "user"
    status: str = "active"

class UserInfo(BaseModel):
    full_name: str
    date_of_birth: str
    phone_number: str
    license_number: str | None = None

class RegisterInfo(BaseModel):
    username: str
    password: str
    full_name: str
    date_of_birth: str
    phone_number: str
    license_number: str | None = None

@auth_router.post("/register")
async def register_user(register_info: RegisterInfo) -> dict:
    if accounts_collection.find_one({"username": register_info.username}):
        raise HTTPException(status_code=400, detail="Username đã tồn tại")

    hashed_pw = pwd_context.hash(register_info.password)
    
    # Tạo tài khoản mới
    new_account = {
        "username": register_info.username,
        "password": hashed_pw,
        "account_type": "user",
        "status": "active"
    }
    
    account_result = accounts_collection.insert_one(new_account)
    account_id = account_result.inserted_id
    
    # Tạo thông tin người dùng liên kết với tài khoản
    new_user = {
        "full_name": register_info.full_name,
        "date_of_birth": register_info.date_of_birth,
        "phone_number": register_info.phone_number,
        "license_number": register_info.license_number,
        "account_id": account_id
    }
    
    users_collection.insert_one(new_user)
    
    return {
        "username": register_info.username,
        "status": "active",
        "account_type": "user"
    }

@auth_router.post("/login")
async def check_login(login_info: LoginInfo) -> dict:
    account = accounts_collection.find_one({"username": login_info.username})

    if not account or not pwd_context.verify(login_info.password, account["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if account["status"] != "active":
        raise HTTPException(status_code=401, detail="Tài khoản đã bị khóa")
    
    # Lấy thêm thông tin người dùng nếu là tài khoản user
    user_data = {
        "username": account["username"],
        "account_type": account["account_type"],
        "status": account["status"]
    }
    
    if account["account_type"] == "user":
        user = users_collection.find_one({"account_id": account["_id"]})
        if user:
            user_data.update({
                "full_name": user["full_name"],
                "date_of_birth": user["date_of_birth"],
                "phone_number": user["phone_number"],
                "license_number": user["license_number"]
            })
    
    return user_data