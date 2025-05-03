# ✅ camera_service backend using FastAPI + MongoDB with soft delete

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
# from pymongo import MongoClient
# import os
from connection import get_database
import httpx

# MongoDB connection setup
# MONGO_URI = os.getenv("MONGO_URI", "localhost:27017/")
# client = MongoClient(MONGO_URI)
# db = client["bktraffic"]
camera_router = APIRouter()

db = get_database()
camera_collection = db["Cameras"]

# Helper: Convert ObjectId to string
def serialize_camera(camera):
    camera["_id"] = str(camera["_id"])
    # print("Cameras from DB:", camera)  # ✅ In dữ liệu ra terminal
    return camera

# Pydantic models
class Location(BaseModel):
    type: str = "Point"
    coordinates: List[float]

class CameraModel(BaseModel):
    Title: str
    Code: str
    DisplayName: str
    CamStatus: str
    SnapshotUrl: Optional[str] = None
    VideoUrl: Optional[str] = None
    PTZ: str
    Angle: int
    CamType: str
    Publish: str
    ManagementUnit: Optional[str] = None
    District: Optional[str] = None
    Location: Location
    VideoStreaming: Optional[int] = 0
    DataId: Optional[str] = None
    NodeId: Optional[str] = ""
    Path: Optional[str] = ""
    CreatedDate: Optional[str] = Field(default_factory=lambda: datetime.now().isoformat())
    ModifiedDate: Optional[str] = Field(default_factory=lambda: datetime.now().isoformat())
    DynamicProperties: Optional[List] = []
    isDelete: Optional[bool] = False

# FastAPI router
camera_router = APIRouter()

@camera_router.get("/api/cameras")
async def get_all_cameras():
    cameras = [serialize_camera(cam) for cam in camera_collection.find({"isDelete": {"$ne": True}})]
    return {"status": "success", "data": cameras}

@camera_router.get("/api/cameras/{camera_id}")
async def get_camera_by_id(camera_id: str):
    cam = camera_collection.find_one({"_id": ObjectId(camera_id), "isDelete": {"$ne": True}})
    if not cam:
        raise HTTPException(status_code=404, detail="Camera không tồn tại")
    return serialize_camera(cam)

@camera_router.post("/api/cameras")
async def create_camera(camera: CameraModel):
    cam_dict = camera.model_dump()
    result = camera_collection.insert_one(cam_dict)
    cam_dict["_id"] = str(result.inserted_id)
    return {"status": "success", "data": cam_dict}

# @camera_router.put("/api/cameras/{camera_id}")
# async def update_camera(camera_id: str, camera: CameraModel):
#     result = camera_collection.update_one(
#         {"_id": ObjectId(camera_id)},
#         {"$set": {**camera.model_dump(), "ModifiedDate": datetime.now().isoformat()}}
#     )
#     if result.modified_count == 0:
#         raise HTTPException(status_code=404, detail="Không thể cập nhật camera")
#     return {"status": "success", "message": "Đã cập nhật camera"}
@camera_router.put("/api/cameras/{camera_id}")
async def update_camera(camera_id: str, camera: CameraModel):
    existing = camera_collection.find_one({"_id": ObjectId(camera_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Camera không tồn tại")

    updated_data = camera.model_dump()
    
    # Đảm bảo không mất giá trị isDelete nếu không được truyền
    if "isDelete" not in updated_data:
        updated_data["isDelete"] = existing.get("isDelete", False)

    updated_data["ModifiedDate"] = datetime.now().isoformat()
    result = camera_collection.update_one(
        {"_id": ObjectId(camera_id)},
        {"$set": updated_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Không thể cập nhật camera")
    return {"status": "success", "message": "Đã cập nhật camera"}


@camera_router.delete("/api/cameras/{camera_id}")
async def soft_delete_camera(camera_id: str):
    result = camera_collection.update_one(
        {"_id": ObjectId(camera_id)},
        {"$set": {"isDelete": True, "ModifiedDate": datetime.now().isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy camera để xoá")
    return {"status": "success", "message": "Đã đánh dấu xoá camera thành công"}

@camera_router.post("/api/cameras/{camera_id}/position")
async def update_camera_position(camera_id: str, lat: float, lng: float):
    result = camera_collection.update_one(
        {"_id": ObjectId(camera_id)},
        {"$set": {"Location.coordinates": [lng, lat], "ModifiedDate": datetime.now().isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Không thể cập nhật vị trí")
    return {"status": "success", "message": "Đã cập nhật vị trí camera"}
