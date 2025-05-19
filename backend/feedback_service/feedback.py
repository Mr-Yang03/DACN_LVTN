from fastapi import APIRouter, Query, Header, HTTPException, Depends, Request, status, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
from connection import get_database
from google.cloud import storage
import os
import uuid

# Use path relative to the script file instead of working directory
script_dir = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(script_dir, "key", "ggmap-456203-58579108ac37.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_path

storage_client = storage.Client()

BUCKET_NAME = "bucket_ggmap-456203"

class FeedbackCreate(BaseModel):
    title: str
    location: str
    type: str
    severity: str
    description: str
    status: str = "Đang xử lý"
    images: List[str] = []
    author: str
    phone_number: str
    email: str
    date: str
    time: str

feedback_router = APIRouter()

db = get_database()
items_collection = db["Items"]  

# Hàm kiểm tra xác thực
async def check_authentication(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.replace("Bearer ", "")
    # Ở đây bạn cần gọi service xác thực để kiểm tra token
    # Đây là mã giả:
    # async with httpx.AsyncClient() as client:
    #     response = await client.post("http://auth-service/verify-token", json={"token": token})
    #     if response.status_code == 200:
    #         return response.json()
    # return None
    
    # Tạm thời để đơn giản, giả lập token "valid_token" là hợp lệ
    if token == "valid_token":
        return {"user_id": "user123", "username": "nguyenvana"}
    return None

@feedback_router.get("/feedback/filter")
async def filter_items(
    severity: Optional[str] = Query(None, description="Mức độ nghiêm trọng"),
    type: Optional[str] = Query(None, description="Loại vấn đề"),
    start_date: Optional[str] = Query(None, description="Ngày bắt đầu (DD/MM/YYYY)"),
    end_date: Optional[str] = Query(None, description="Ngày kết thúc (DD/MM/YYYY)")
):
    """
    Lọc phản ánh theo mức độ nghiêm trọng, loại vấn đề, và khoảng thời gian
    """
    # Xây dựng query filter
    filter_query = {}
    
    # Thêm điều kiện lọc theo mức độ nghiêm trọng nếu có
    if severity and severity != "Tất cả mức độ":
        filter_query["severity"] = severity
    
    # Thêm điều kiện lọc theo loại vấn đề nếu có
    if type and type != "Tất cả vấn đề":
        filter_query["type"] = type
    
    # Bước 1: Truy vấn trước (chưa lọc ngày)
    cursor = items_collection.find(filter_query)

    items = []
    if (start_date and end_date and start_date != "" and end_date != ""):
        try:
            # Bước 2: Chuyển start_date, end_date thành datetime
            start_dt = datetime.strptime(start_date, "%d/%m/%Y") if start_date else None
            end_dt = datetime.strptime(end_date, "%d/%m/%Y") if end_date else None
        except ValueError:
            return {
                "status": "error",
                "message": "Định dạng ngày không hợp lệ. Định dạng đúng: DD/MM/YYYY"
            }

        for doc in cursor:
            raw_date = doc.get("date", "")

            # Chuyển đổi ngày từ chuỗi thành datetime
            date_formats = ["%d/%m/%Y", "%d-%m-%Y"]
            parsed_date = None
            for fmt in date_formats:
                try:
                    parsed_date = datetime.strptime(raw_date, fmt)
                    break
                except ValueError:
                    continue

            # Nếu không parse được -> bỏ qua document
            if parsed_date is None:
                continue

            # Bước 3: Lọc theo khoảng thời gian
            if start_dt and parsed_date < start_dt:
                continue
            if end_dt and parsed_date > end_dt:
                continue

            # Chuyển _id về chuỗi
            doc["_id"] = str(doc["_id"])
            # Chuyển date về format chuẩn
            doc["date"] = parsed_date.strftime("%d/%m/%Y")
            items.append(doc)
        
    for document in cursor:
        document["_id"] = str(document["_id"])
        items.append(document)
    
    # Trả về kết quả với thông tin về các bộ lọc đã áp dụng
    return {
        "status": "success",
        "data": items,
        "total": len(items),
        "filters": {
            "severity": severity,
            "type": type,
            "start_date": start_date,
            "end_date": end_date
        }
    }

@feedback_router.get("/feedback/all")
async def get_all_items():
    """
    Lấy tất cả các items từ collection Items trong database Feedback
    """
    items = []
    cursor = items_collection.find({})
    
    for document in cursor:
        raw_date = document.get("date", "")
        raw_time = document.get("time", "00:00")  # mặc định nếu không có giờ

        # Kết hợp ngày + giờ để parse thành datetime
        combined_str = f"{raw_date} {raw_time}"
        datetime_formats = ["%d/%m/%Y %H:%M", "%d-%m-%Y %H:%M"]
        parsed_datetime = None
        for fmt in datetime_formats:
            try:
                parsed_datetime = datetime.strptime(combined_str, fmt)
                break
            except ValueError:
                continue

        # Bỏ qua nếu không parse được
        if parsed_datetime is None:
            continue

        document["_id"] = str(document["_id"])
        document["datetime"] = parsed_datetime
        items.append(document)

    # Sắp xếp theo datetime giảm dần
    items.sort(key=lambda x: x["datetime"], reverse=True)

    # Xóa trường datetime trước khi trả về
    for doc in items:
        del doc["datetime"]
    
    return items

# # API hiển thị những phản ánh đã xử lý
# @feedback_router.get("/feedback/processed", response_model=List[dict])
# async def get_processed_items():
#     """
#     Lấy danh sách phản ánh đã được xử lý (status = "Đã xử lý")
#     """
#     items = []
#     cursor = items_collection.find({"status": "Đã xử lý"})
    
#     for document in cursor:
#         document["_id"] = str(document["_id"])
#         items.append(document)
    
#     return items

@feedback_router.get("/feedback/item/{item_id}")
async def get_item_by_id(item_id: str):
    """
    Lấy item theo ID
    """    
    item = items_collection.find_one({"_id": ObjectId(item_id)})
    
    if item:
        item["_id"] = str(item["_id"])
        return {"status": "success", "data": item}
    
    return {"status": "error", "message": "Item không tồn tại"}

@feedback_router.post("/feedback/items")
async def create_feedback(feedback: dict = Body(...)):
    """
    Thêm mới feedback vào database
    Yêu cầu người dùng đăng nhập, nếu không sẽ điều hướng đến trang đăng nhập
    """
    try:
        # Add metadata
        feedback["created_at"] = datetime.utcnow()
        feedback["updated_at"] = datetime.utcnow()
        
        # Chèn vào database
        result = items_collection.insert_one(feedback)
        
        # Return created news with ID
        created_feedback = feedback.copy()
        created_feedback["_id"] = str(result.inserted_id)
        
        return created_feedback
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @feedback_router.get("/items/search")
# async def search_items(q: str = Query(None, description="Từ khóa tìm kiếm trong tiêu đề hoặc địa điểm")):
#     """
#     Tìm kiếm phản ánh theo tiêu đề hoặc địa điểm
#     """
#     if not q:
#         # Nếu không có từ khóa tìm kiếm, trả về tất cả items
#         return await get_all_items()
    
#     # Tạo truy vấn tìm kiếm với $regex để tìm kiếm không phân biệt hoa thường
#     query = {
#         "$or": [
#             {"title": {"$regex": q, "$options": "i"}},
#             {"location": {"$regex": q, "$options": "i"}}
#         ]
#     }
    
#     items = []
#     cursor = items_collection.find(query)
    
#     for document in cursor:
#         document["_id"] = str(document["_id"])
#         items.append(document)
    
#     return {"status": "success", "data": items, "total": len(items), "search_term": q}

# # API xóa phản ánh ở trạng thái "Đang xử lý" --> thêm trạng thái isDelete???
# @feedback_router.delete("/items/{item_id}")
# async def delete_feedback(item_id: str, admin=Depends(check_admin)):
#     """
#     Xóa phản ánh ở trạng thái "Đang xử lý"
#     Nếu muốn xóa phản ánh ở trạng thái "Đã xử lý" thì cần hủy duyệt trước
#     Chỉ admin mới có quyền thực hiện
#     """
#     try:
#         # Kiểm tra phản ánh có tồn tại không
#         item = items_collection.find_one({"_id": ObjectId(item_id)})
#         if not item:
#             return {"status": "error", "message": "Phản ánh không tồn tại"}
        
#         # Kiểm tra trạng thái
#         if item.get("status") != "Đang xử lý":
#             return {
#                 "status": "error", 
#                 "message": "Chỉ có thể xóa phản ánh ở trạng thái 'Đang xử lý'. Vui lòng hủy duyệt trước khi xóa."
#             }
        
#         # Thực hiện xóa
#         result = items_collection.delete_one({"_id": ObjectId(item_id)})
        
#         if result.deleted_count:
#             return {"status": "success", "message": "Đã xóa phản ánh thành công"}
        
#         return {"status": "error", "message": "Không thể xóa phản ánh"}
    
#     except Exception as e:
#         return {"status": "error", "message": f"Lỗi: {str(e)}"}

@feedback_router.post("/feedback/upload")
async def upload_feedback_files(files: List[UploadFile] = File(...)):
    """
    Upload multiple images/videos from a feedback form to Google Cloud Storage.
    """
    try:
        uploaded_files = []
        
        for file in files:
            # Generate a unique filename
            file_extension = file.filename.split(".")[-1] if "." in file.filename else ""
            unique_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}.{file_extension}"
            
            # Read file content
            content = await file.read()
            
            try:
                # Get bucket
                bucket = storage_client.bucket(BUCKET_NAME)
                
                # Check if bucket exists
                if not bucket.exists():
                    return JSONResponse(
                        status_code=500,
                        content={"detail": f"Bucket {BUCKET_NAME} does not exist or is not accessible"}
                    )
                    
                # Upload to Google Cloud Storage
                blob = bucket.blob(f"feedback_files/{unique_filename}")
                
                # Get the correct content type or default to a safe option
                content_type = file.content_type or "application/octet-stream"
                
                # Set content type 
                blob.content_type = content_type
                
                # Upload the file
                print(f"Uploading file {file.filename} to Cloud Storage...")
                blob.upload_from_string(
                    content,
                    content_type=content_type
                )
                print(f"File {file.filename} uploaded successfully")
                
                # Generate a public URL
                public_url = f"https://storage.googleapis.com/{BUCKET_NAME}/feedback_files/{unique_filename}"
                print(f"Public URL: {public_url}")
                
                # Add to the list of uploaded files
                uploaded_files.append({
                    "original_filename": file.filename,
                    "file_url": public_url,
                    "public_url": public_url
                })
                
            except Exception as storage_error:
                print(f"Storage error for file {file.filename}: {str(storage_error)}")
                # Continue with other files instead of failing completely
                uploaded_files.append({
                    "original_filename": file.filename,
                    "error": str(storage_error)
                })
        
        return {
            "uploaded_files": uploaded_files,
            "count": len(uploaded_files)
        }
            
    except Exception as e:
        print(f"Failed to upload files: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Failed to upload files: {str(e)}"}
        )