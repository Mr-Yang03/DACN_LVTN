from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from connection import get_database
from models import UserCreate, UserUpdate
#add
from models import PasswordResetRequest
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
#

userboard_router = APIRouter()

db = get_database()
db["users"].create_index("account_id")
db["accounts"].create_index("_id")  # Thường đã có sẵn vì là primary key
collection = db["users"]

def user_to_dict(user):
    user["_id"] = str(user["_id"])
    if "account_id" in user and isinstance(user["account_id"], ObjectId):
        user["account_id"] = str(user["account_id"])
    return user

# @userboard_router.get("/userboard/ub")
# def get_users():
#     users_collection = db["users"]
#     accounts_collection = db["accounts"]

#     users = []
#     for user in users_collection.find({"is_deleted": {"$ne": True}}):
#         account_id = user.get("account_id")
        
#         # 👉 Convert string to ObjectId nếu cần
#         try:
#             if isinstance(account_id, str):
#                 account_id = ObjectId(account_id)
#             account = accounts_collection.find_one({"_id": account_id})
#             user["username"] = account.get("username") if account else None
#         except Exception:
#             user["username"] = None

#         # Convert _id và account_id về string
#         user["_id"] = str(user["_id"])
#         user["account_id"] = str(user.get("account_id", ""))

#         users.append(user)

#     return [user_to_dict(user) for user in users]
@userboard_router.get("/userboard/ub")
def get_users():
    users_collection = db["users"]

    pipeline = [
        {
            "$match": {
                "is_deleted": {"$ne": True}
            }
        },
        {
            "$lookup": {
                "from": "accounts",
                "localField": "account_id",
                "foreignField": "_id",
                "as": "account_info"
            }
        },
        {
            "$unwind": {
                "path": "$account_info",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "full_name": 1,
                "date_of_birth": 1,
                "phone_number": 1,
                "license_number": 1,
                "account_id": {
                    "$cond": {
                        "if": {"$ifNull": ["$account_id", False]},
                        "then": {"$toString": "$account_id"},
                        "else": None
                    }
                },
                "username": "$account_info.username"
            }
        }
    ]

    users = list(users_collection.aggregate(pipeline))
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

        # Nếu account_id là rỗng hoặc không hợp lệ, loại bỏ khỏi update
        if update_data.get("account_id"):
            try:
                update_data["account_id"] = ObjectId(update_data["account_id"])
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid account_id")
        else:
            update_data.pop("account_id", None)  # Không cập nhật nếu thiếu hoặc rỗng

        result = collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        return user_to_dict(collection.find_one({"_id": ObjectId(user_id)}))

    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

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

##changepass
@userboard_router.put("/userboard/ub/reset-password/{account_id}")
def reset_password(account_id: str, data: PasswordResetRequest):
    accounts = db["accounts"]
    try:
        hashed_pw = pwd_context.hash(data.new_password)
        result = accounts.update_one(
            {"_id": ObjectId(account_id)},
            {"$set": {"password": hashed_pw}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Account not found")
        return {"message": "Password updated successfully"}
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid account ID")
