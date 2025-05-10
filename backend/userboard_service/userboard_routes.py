from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from connection import get_database
from models import UserCreate, UserUpdate

userboard_router = APIRouter()

db = get_database()
collection = db["users"]

def user_to_dict(user):
    user["_id"] = str(user["_id"])
    if "account_id" in user and isinstance(user["account_id"], ObjectId):
        user["account_id"] = str(user["account_id"])
    return user

@userboard_router.get("/userboard/ub")
def get_users():
    users = list(collection.find({"is_deleted": {"$ne": True}}))
    return [user_to_dict(user) for user in users]

@userboard_router.get("/userboard/ub/{user_id}")
def get_user(user_id: str):
    try:
        user = collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user_to_dict(user)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

@userboard_router.post("/userboard/ub")
def create_user(user: UserCreate):
    user_dict = user.dict()
    if user_dict.get("account_id"):
        user_dict["account_id"] = ObjectId(user_dict["account_id"])
    result = collection.insert_one(user_dict)
    return user_to_dict(collection.find_one({"_id": result.inserted_id}))

@userboard_router.put("/userboard/ub/{user_id}")
def update_user(user_id: str, user: UserUpdate):
    try:
        update_data = user.dict()
        if update_data.get("account_id"):
            update_data["account_id"] = ObjectId(update_data["account_id"])
        result = collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return user_to_dict(collection.find_one({"_id": ObjectId(user_id)}))
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

# @userboard_router.delete("/userboard/ub/{user_id}")
# def delete_user(user_id: str):
#     try:
#         result = collection.delete_one({"_id": ObjectId(user_id)})
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="User not found")
#         return {"message": "User deleted successfully"}
#     except InvalidId:
#         raise HTTPException(status_code=400, detail="Invalid user ID")
@userboard_router.delete("/userboard/ub/{user_id}")
def soft_delete_user(user_id: str):
    try:
        result = collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_deleted": True}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User marked as deleted"}
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")
