# app/main.py
from fastapi import APIRouter, Query
from connection import get_database
import requests

traffic_router = APIRouter()

db = get_database()
user_collection = db["cameras"]

@traffic_router.get("/status")
def get_traffic_status(
    lng: float = Query(..., description="Kinh độ"),
    lat: float = Query(..., description="Vĩ độ"),
    start_time: str = Query(..., description="Thời gian bắt đầu (ISO format)"),
    end_time: str = Query(..., description="Thời gian kết thúc (ISO format)")
):
    """
    Gọi API BKTraffic để lấy dữ liệu giao thông theo tọa độ và khoảng thời gian.
    """
    url = "https://api.bktraffic.com/api/get-public-data"

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "type": "circle",
        "coordinates": [[lat, lng]],
        "radius": 10,
        "time": {
            "start": start_time,
            "end": end_time
        }
    }

    response = requests.post(url, headers=headers, json=payload)

    try:
        data = response.json()
    except Exception:
        data = {"error": "Không thể phân tích dữ liệu trả về từ BKTraffic API."}

    return {"data": data}

@traffic_router.get("/camera")
async def get_camera_location():
    cameras = user_collection.find().to_list(length=None)

    info = [{
        "Id": str(camera["_id"]),
        "Title": camera["Title"],
        "Location": camera["Location"],
        "SnapshotUrl": camera["SnapshotUrl"],
        "DisplayName": camera["DisplayName"],
        "Status": "active" if camera["CamStatus"] == "UP" else "inactive",

    } for camera in cameras]

    return {"cameras": info}