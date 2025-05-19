from fastapi import APIRouter, HTTPException, Query, Body, UploadFile, File
from pydantic import BaseModel
from connection import get_database
from passlib.context import CryptContext
from bson import ObjectId
from fastapi.responses import JSONResponse
import uuid
import os
from datetime import datetime
from google.cloud import storage

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key/ggmap-456203-58579108ac37.json"

storage_client = storage.Client()
BUCKET_NAME = "bucket_ggmap-456203"  # Same bucket as used in news-feedback_service

auth_router = APIRouter()

db = get_database()
accounts_collection = db["accounts"]
users_collection = db["users"]
admins_collection = db["admins"]

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

class AdminRegisterInfo(BaseModel):
    username: str
    password: str
    full_name: str
    date_of_birth: str
    phone_number: str
    citizen_id: str

def objectid_to_str(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: objectid_to_str(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [objectid_to_str(v) for v in obj]
    return obj

@auth_router.get("/check-username/{username}")
async def check_username_exists(username: str) -> dict:
    """
    Kiểm tra xem username đã tồn tại trong hệ thống hay chưa
    """
    existing_user = accounts_collection.find_one({"username": username})
    return {"exists": existing_user is not None}

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
        "status": "active",
        "avatar": ""
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
        "_id": account["_id"],
        "username": account["username"],
        "account_type": account["account_type"],
        "status": account["status"], 
        "avatar": account["avatar"]
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

    # Chuyển đổi ObjectId thành chuỗi
    user_data = objectid_to_str(user_data)
    
    return user_data

@auth_router.post("/admin/login")
async def admin_login(login_info: LoginInfo) -> dict:
    account = accounts_collection.find_one({"username": login_info.username})

    if not account or not pwd_context.verify(login_info.password, account["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if account["status"] != "active":
        raise HTTPException(status_code=401, detail="Tài khoản đã bị khóa")
    
    # Xác minh đây là tài khoản admin
    if account["account_type"] != "admin":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập. Chỉ admin mới được phép đăng nhập.")
    
    # Lấy thông tin admin
    admin_data = {
        "username": account["username"],
        "account_type": account["account_type"],
        "status": account["status"]
    }
    
    admin = admins_collection.find_one({"account_id": account["_id"]})
    if admin:
        admin_data.update({
            "full_name": admin["full_name"],
            "date_of_birth": admin["date_of_birth"],
            "phone_number": admin["phone_number"],
            "citizen_id": admin.get("citizen_id")
        })
    
    return admin_data

@auth_router.post("/admin/register")
async def register_admin(register_info: AdminRegisterInfo) -> dict:
    if accounts_collection.find_one({"username": register_info.username}):
        raise HTTPException(status_code=400, detail="Username đã tồn tại")

    hashed_pw = pwd_context.hash(register_info.password)
    
    # Tạo tài khoản admin mới
    new_account = {
        "username": register_info.username,
        "password": hashed_pw,
        "account_type": "admin",
        "status": "active"
    }
    
    account_result = accounts_collection.insert_one(new_account)
    account_id = account_result.inserted_id
    
    # Tạo thông tin admin liên kết với tài khoản
    new_admin = {
        "full_name": register_info.full_name,
        "date_of_birth": register_info.date_of_birth,
        "phone_number": register_info.phone_number,
        "citizen_id": register_info.citizen_id,
        "account_id": account_id
    }
    
    admins_collection.insert_one(new_admin)
    
    return {
        "username": register_info.username,
        "status": "active",
        "account_type": "admin"
    }

@auth_router.put("/update") 
async def update_user_info(
    account_id: str = Query(...),
    user_info: UserInfo = Body(...)
) -> dict:
    account = accounts_collection.find_one({"_id": ObjectId(account_id)})
    
    if not account:
        raise HTTPException(status_code=404, detail="Tài khoản không tồn tại")
    
    # Cập nhật thông tin người dùng
    users_collection.update_one(
        {"account_id": account["_id"]},
        {"$set": {
            "full_name": user_info.full_name,
            "date_of_birth": user_info.date_of_birth,
            "phone_number": user_info.phone_number,
            "license_number": user_info.license_number
        }}
    )

    updated_user = {
        "account_id": str(account["_id"]),
        "full_name": user_info.full_name,
        "date_of_birth": user_info.date_of_birth,
        "phone_number": user_info.phone_number,
        "license_number": user_info.license_number
    }
    
    return {"status": "success", "message": "Thông tin đã được cập nhật", "data": updated_user}

@auth_router.post("/avatar/upload")
async def upload_avatar(file: UploadFile = File(...)):
    """
    Upload an image for a news article to Google Cloud Storage.
    """
    try:
        # Generate a unique filename
        file_extension = file.filename.split(".")[-1] if "." in file.filename else ""
        unique_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}.{file_extension}"
        
        # Log the file info for debugging
        print(f"Uploading file: {file.filename}, Size: {file.size}, Content-Type: {file.content_type}")
        
        # Check if credentials file exists and is accessible
        creds_path = "key/ggmap-456203-58579108ac37.json"
        if not os.path.exists(creds_path):
            return JSONResponse(
                status_code=500,
                content={"detail": f"Credentials file not found: {creds_path}"}
            )
            
        print(f"Credentials file found at: {creds_path}")
        
        # Read file content
        content = await file.read()
        print(f"File content read, size: {len(content)} bytes")
        
        try:
            # Try to initialize storage client
            print("Initializing storage client...")
            bucket = storage_client.bucket(BUCKET_NAME)
            
            # Check if bucket exists
            if not bucket.exists():
                return JSONResponse(
                    status_code=500,
                    content={"detail": f"Bucket {BUCKET_NAME} does not exist or is not accessible"}
                )
                
            print(f"Bucket {BUCKET_NAME} found")
            
            # Upload to Google Cloud Storage
            blob = bucket.blob(f"news_images/{unique_filename}")
            
            # Get the correct content type or default to a safe option
            content_type = file.content_type or "application/octet-stream"
            print(f"Using content type: {content_type}")
            
            # Set content type 
            blob.content_type = content_type
            
            # Upload the file explicitly specifying the same content_type
            print("Uploading file to Cloud Storage...")
            blob.upload_from_string(
                content,
                content_type=content_type  # Explicitly pass the same content_type here
            )
            print("File uploaded successfully")
            
            # Generate a public URL - use predefined URL pattern instead of ACLs
            # This assumes the bucket has uniform bucket-level access enabled and is publicly accessible
            public_url = f"https://storage.googleapis.com/{BUCKET_NAME}/news_images/{unique_filename}"
            print(f"Public URL: {public_url}")
            
            return {
                "file_url": public_url,
                "public_url": public_url  # For compatibility with frontend
            }
        except Exception as storage_error:
            print(f"Storage error: {str(storage_error)}")
            return JSONResponse(
                status_code=500,
                content={"detail": f"Storage error: {str(storage_error)}"}
            )
            
    except Exception as e:
        print(f"Failed to upload image: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Failed to upload image: {str(e)}"}
        )
    
@auth_router.put("/avatar/update") 
async def update_avatar(
    account_id: str = Query(...),
    fileUrl: str = Body(...),
) -> dict:
    # Validate the URL
    if not fileUrl.startswith("https://storage.googleapis.com/"):
        raise HTTPException(status_code=400, detail="Invalid file URL")
    
    # Update the avatar URL in the account
    accounts_collection.update_one(
        {"_id": ObjectId(account_id)},
        {"$set": {"avatar": fileUrl}}
    )
    
    return {"status": "success", "message": "Avatar đã được cập nhật", "data": {"avatar": fileUrl}}