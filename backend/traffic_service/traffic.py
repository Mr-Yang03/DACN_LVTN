# app/main.py
from fastapi import APIRouter, Query
from connection import get_database
import requests
from datetime import datetime, timedelta
import random

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
        return data
    except Exception:
        return {"error": "Không thể phân tích dữ liệu trả về từ BKTraffic API."}

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

@traffic_router.get("/camera/{camera_id}/speed")
async def get_camera_speed(
    camera_id: str,
    start_time: str = Query(..., description="Thời gian bắt đầu (ISO format)"),
    end_time: str = Query(..., description="Thời gian kết thúc (ISO format)")
):
    """
    Lấy dữ liệu tốc độ thực tế từ camera theo ID
    """
    try:
        # Tìm camera trong database để lấy vị trí
        camera = user_collection.find_one({"_id": camera_id})
        
        if not camera:
            return {"error": "Camera không tồn tại"}
        
        # Lấy vị trí camera
        location = camera.get("Location", {}).get("coordinates", [])
        
        if not location or len(location) < 2:
            return {"error": "Không tìm thấy thông tin vị trí camera"}
        
        lng, lat = location
        
        # Kết nối với API thực để lấy dữ liệu tốc độ
        url = "https://api.bktraffic.com/api/get-public-data"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        payload = {
            "type": "circle",
            "coordinates": [[lat, lng]],
            "radius": 30,
            "time": {
                "start": start_time,
                "end": end_time
            }
        }
        
        # Gọi API thực tế để lấy dữ liệu
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        
        if response_data.get("code") != 200 or "data" not in response_data:
            return {"error": "Không thể lấy dữ liệu từ API", "raw_response": response_data}
        
        # Xử lý dữ liệu trả về từ API
        traffic_data = response_data.get("data", [])
        
        # Chuyển đổi dữ liệu sang định dạng cần thiết
        processed_data = []
        
        first_street = traffic_data[0].get("segmentId")
        for segment in traffic_data:
            if segment.get("segmentId") == first_street:
                processed_data.append({
                "timestamp": segment.get("time"),
                "averageSpeed": segment.get("velocity"),
                "street": segment.get("street", {}).get("name", "Unknown"),
                "segmentId": segment.get("segmentId"),
                "congestionLevel": segment.get("los"),
                "coordinates": segment.get("polyline", {}).get("coordinates", [])
                })
        
        return {
            "data": processed_data, 
            "camera_id": camera_id,
            "total_segments": len(processed_data)
        }
        
    except Exception as e:
        return {"error": str(e)}

@traffic_router.get("/camera/{camera_id}/vehicle-types")
async def get_vehicle_types(
    camera_id: str,
    start_time: str = Query(..., description="Thời gian bắt đầu (ISO format)"),
    end_time: str = Query(..., description="Thời gian kết thúc (ISO format)")
):
    """
    API thử nghiệm - Lấy dữ liệu phân loại phương tiện (xe máy, ô tô, xe tải, xe buýt)
    """
    try:
        # Tìm camera trong database để lấy vị trí
        camera = user_collection.find_one({"_id": camera_id})
        
        if not camera:
            return {"error": "Camera không tồn tại"}
        
        # Tạo dữ liệu thử nghiệm phân loại phương tiện
        # Trong môi trường thực tế, dữ liệu này sẽ được lấy từ hệ thống AI phân tích video
        
        # Tính khoảng thời gian giữa start_time và end_time
        start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
        
        time_diff = (end_dt - start_dt).total_seconds() / 3600  # Số giờ
        
        # Tạo dữ liệu mẫu dựa trên khoảng thời gian
        total_vehicles = int(100 * time_diff)  # Giả sử có 100 xe mỗi giờ
        
        # Phân bổ theo loại phương tiện (% thực tế sẽ dựa trên phân tích video)
        motorcycle_count = int(total_vehicles * 0.72)  # 72% xe máy
        car_count = int(total_vehicles * 0.22)  # 22% ô tô
        truck_count = int(total_vehicles * 0.05)  # 5% xe tải
        bus_count = int(total_vehicles * 0.01)  # 1% xe buýt
        
        # Điều chỉnh tổng số nếu có sai số làm tròn
        actual_total = motorcycle_count + car_count + truck_count + bus_count
        if actual_total != total_vehicles:
            motorcycle_count += (total_vehicles - actual_total)
        
        # Tạo dữ liệu phân tích phương tiện
        vehicle_data = {
            "camera_id": camera_id,
            "timestamp": datetime.now().isoformat(),
            "period": {
                "start": start_time,
                "end": end_time
            },
            "totalVehicles": total_vehicles,
            "vehicleTypes": {
                "motorcycle": {
                    "count": motorcycle_count,
                    "percentage": round(motorcycle_count / total_vehicles * 100, 1) if total_vehicles > 0 else 0
                },
                "car": {
                    "count": car_count,
                    "percentage": round(car_count / total_vehicles * 100, 1) if total_vehicles > 0 else 0
                },
                "truck": {
                    "count": truck_count,
                    "percentage": round(truck_count / total_vehicles * 100, 1) if total_vehicles > 0 else 0
                },
                "bus": {
                    "count": bus_count,
                    "percentage": round(bus_count / total_vehicles * 100, 1) if total_vehicles > 0 else 0
                }
            }
        }
        
        return vehicle_data
        
    except Exception as e:
        return {"error": str(e)}