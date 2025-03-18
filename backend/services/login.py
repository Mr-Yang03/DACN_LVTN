from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.connection import get_database

login_router = APIRouter()

db = get_database()
user_collection = db["user"]


class LoginInfo(BaseModel):
    email: str
    password: str


@login_router.post("/login")
async def check_login(login_info: LoginInfo) -> dict:
    check_user = user_collection.find_one(
        {"email": login_info.email, "password": login_info.password}
    )

    if not check_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"username": login_info.email}

@login_router.get("/users/all")
async def get_all_users() -> list:
    users = user_collection.find({}, {"_id": 0, "email": 1, "password": 1})
    return list(users)