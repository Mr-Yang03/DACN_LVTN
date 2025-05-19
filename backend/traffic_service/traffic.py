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
    với phân phối thay đổi theo giờ trong ngày và có yếu tố ngẫu nhiên
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
        
        # Lấy giờ trong ngày để điều chỉnh phân phối theo giờ
        start_hour = start_dt.hour
        end_hour = end_dt.hour if end_dt.day == start_dt.day else (end_dt.hour + 24)
        
        # Xác định các mốc giờ đặc biệt trong ngày
        morning_rush_start, morning_rush_end = 7, 9       # Giờ cao điểm buổi sáng
        evening_rush_start, evening_rush_end = 16, 19     # Giờ cao điểm buổi chiều
        night_start, night_end = 20, 6                   # Giờ đêm khuya
        
        # Tổng số phương tiện thay đổi tùy theo giờ trong ngày (xe/giờ)
        # và có thêm yếu tố ngẫu nhiên
        vehicles_per_hour = []
        for hour in range(start_hour, end_hour + 1):
            hour_of_day = hour % 24
            
            # Điều chỉnh tùy theo giờ trong ngày
            if (morning_rush_start <= hour_of_day < morning_rush_end):  # Giờ cao điểm sáng
                base_count = 1800 + random.randint(-200, 200)  # 180 ± 20 xe/giờ
            elif (evening_rush_start <= hour_of_day < evening_rush_end):  # Giờ cao điểm chiều
                base_count = 2000 + random.randint(-250, 250)  # 200 ± 25 xe/giờ
            elif ((night_start <= hour_of_day) or (hour_of_day < night_end)):  # Giờ đêm khuya
                base_count = 500 + random.randint(-100, 150)   # 50 ± 10-15 xe/giờ
            else:  # Giờ thường trong ngày
                base_count = 1000 + random.randint(-150, 150)  # 100 ± 15 xe/giờ
                
            vehicles_per_hour.append(base_count)
        
        # Tính tổng số phương tiện dựa trên khoảng thời gian
        # Xử lý trường hợp giờ lẻ (không phải giờ tròn)
        total_vehicles = 0
        for i, count in enumerate(vehicles_per_hour):
            if i == 0:  # Giờ đầu
                fraction = 1 - (start_dt.minute / 60)
                total_vehicles += count * fraction
            elif i == len(vehicles_per_hour) - 1:  # Giờ cuối
                fraction = end_dt.minute / 60
                total_vehicles += count * fraction
            else:  # Giờ giữa
                total_vehicles += count
                
        total_vehicles = int(total_vehicles)
        
        # Phân phối loại phương tiện thay đổi theo giờ
        # Các tỷ lệ phần trăm phải tổng là 1 (100%)
        motorcycle_percent = 0
        car_percent = 0
        truck_percent = 0
        bus_percent = 0
        
        # Tính tỷ lệ trung bình dựa trên từng giờ
        for hour in range(start_hour, end_hour + 1):
            hour_of_day = hour % 24
            
            if (morning_rush_start <= hour_of_day < morning_rush_end):  # Giờ cao điểm sáng
                # Nhiều xe máy và ô tô trong giờ cao điểm sáng
                motorcycle_percent += 0.75 + random.uniform(-0.05, 0.05)  # 75% ± 5%
                car_percent += 0.20 + random.uniform(-0.03, 0.03)        # 20% ± 3%
                truck_percent += 0.03 + random.uniform(-0.01, 0.01)      # 3% ± 1%
                bus_percent += 0.02 + random.uniform(-0.005, 0.005)      # 2% ± 0.5%
            elif (evening_rush_start <= hour_of_day < evening_rush_end):  # Giờ cao điểm chiều
                # Tương tự giờ cao điểm sáng
                motorcycle_percent += 0.73 + random.uniform(-0.05, 0.05)  # 73% ± 5%
                car_percent += 0.22 + random.uniform(-0.03, 0.03)        # 22% ± 3%
                truck_percent += 0.03 + random.uniform(-0.01, 0.01)      # 3% ± 1%
                bus_percent += 0.02 + random.uniform(-0.005, 0.005)      # 2% ± 0.5%
            elif ((night_start <= hour_of_day) or (hour_of_day < night_end)):  # Giờ đêm khuya
                # Ít xe máy, nhiều xe tải vào ban đêm
                motorcycle_percent += 0.40 + random.uniform(-0.05, 0.05)  # 40% ± 5%
                car_percent += 0.30 + random.uniform(-0.03, 0.03)        # 30% ± 3%
                truck_percent += 0.25 + random.uniform(-0.03, 0.03)      # 25% ± 3%
                bus_percent += 0.05 + random.uniform(-0.01, 0.01)        # 5% ± 1%
            else:  # Giờ thường trong ngày
                # Phân bổ cân đối hơn
                motorcycle_percent += 0.65 + random.uniform(-0.05, 0.05)  # 65% ± 5%
                car_percent += 0.25 + random.uniform(-0.03, 0.03)        # 25% ± 3%
                truck_percent += 0.07 + random.uniform(-0.02, 0.02)      # 7% ± 2%
                bus_percent += 0.03 + random.uniform(-0.01, 0.01)        # 3% ± 1%
        
        # Chia trung bình cho số giờ để tính tỷ lệ phần trăm
        num_hours = end_hour - start_hour + 1
        motorcycle_percent /= num_hours
        car_percent /= num_hours
        truck_percent /= num_hours
        bus_percent /= num_hours
        
        # Chuẩn hóa để tổng = 1 (100%)
        total_percent = motorcycle_percent + car_percent + truck_percent + bus_percent
        motorcycle_percent /= total_percent
        car_percent /= total_percent
        truck_percent /= total_percent
        bus_percent /= total_percent
        
        # Tính số lượng từng loại phương tiện
        motorcycle_count = int(total_vehicles * motorcycle_percent)
        car_count = int(total_vehicles * car_percent)
        truck_count = int(total_vehicles * truck_percent)
        bus_count = int(total_vehicles * bus_percent)
        
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
            },
            "hourlyData": []
        }
        
        # Thêm dữ liệu phân bổ theo từng giờ để hiển thị chi tiết hơn
        current_hour = start_dt
        while current_hour <= end_dt:
            hour_of_day = current_hour.hour
            
            # Xác định loại giờ (cao điểm sáng, cao điểm chiều, đêm khuya, giờ bình thường)
            hour_type = ""
            if morning_rush_start <= hour_of_day < morning_rush_end:
                hour_type = "morning_rush"
            elif evening_rush_start <= hour_of_day < evening_rush_end:
                hour_type = "evening_rush"
            elif (night_start <= hour_of_day) or (hour_of_day < night_end):
                hour_type = "night"
            else:
                hour_type = "regular"
            
            # Tạo dữ liệu xe cho giờ này
            hour_vehicles = 0
            if hour_of_day == start_dt.hour and hour_of_day == end_dt.hour:
                fraction = (end_dt.minute - start_dt.minute) / 60
                hour_vehicles = int(vehicles_per_hour[0] * fraction) if len(vehicles_per_hour) > 0 else 0
            elif hour_of_day == start_dt.hour:
                fraction = (60 - start_dt.minute) / 60
                hour_vehicles = int(vehicles_per_hour[0] * fraction) if len(vehicles_per_hour) > 0 else 0
            elif hour_of_day == end_dt.hour:
                fraction = end_dt.minute / 60
                idx = hour_of_day - start_dt.hour
                hour_vehicles = int(vehicles_per_hour[idx] * fraction) if idx < len(vehicles_per_hour) else 0
            else:
                idx = hour_of_day - start_dt.hour
                hour_vehicles = vehicles_per_hour[idx] if idx < len(vehicles_per_hour) else 0
                
            # Tạo phân phối loại xe cho giờ này với ngẫu nhiên riêng
            h_motorcycle_percent = 0
            h_car_percent = 0
            h_truck_percent = 0
            h_bus_percent = 0
            
            if hour_type == "morning_rush":
                h_motorcycle_percent = 0.75 + random.uniform(-0.05, 0.05)
                h_car_percent = 0.20 + random.uniform(-0.03, 0.03)
                h_truck_percent = 0.03 + random.uniform(-0.01, 0.01)
                h_bus_percent = 0.02 + random.uniform(-0.005, 0.005)
            elif hour_type == "evening_rush":
                h_motorcycle_percent = 0.73 + random.uniform(-0.05, 0.05)
                h_car_percent = 0.22 + random.uniform(-0.03, 0.03)
                h_truck_percent = 0.03 + random.uniform(-0.01, 0.01)
                h_bus_percent = 0.02 + random.uniform(-0.005, 0.005)
            elif hour_type == "night":
                h_motorcycle_percent = 0.40 + random.uniform(-0.05, 0.05)
                h_car_percent = 0.30 + random.uniform(-0.03, 0.03)
                h_truck_percent = 0.25 + random.uniform(-0.03, 0.03)
                h_bus_percent = 0.05 + random.uniform(-0.01, 0.01)
            else:
                h_motorcycle_percent = 0.65 + random.uniform(-0.05, 0.05)
                h_car_percent = 0.25 + random.uniform(-0.03, 0.03)
                h_truck_percent = 0.07 + random.uniform(-0.02, 0.02)
                h_bus_percent = 0.03 + random.uniform(-0.01, 0.01)
            
            # Chuẩn hóa tỉ lệ để tổng = 1 (100%)
            total_h_percent = h_motorcycle_percent + h_car_percent + h_truck_percent + h_bus_percent
            h_motorcycle_percent /= total_h_percent
            h_car_percent /= total_h_percent
            h_truck_percent /= total_h_percent
            h_bus_percent /= total_h_percent
            
            # Tính số lượng từng loại xe trong giờ này
            h_motorcycle = int(hour_vehicles * h_motorcycle_percent)
            h_car = int(hour_vehicles * h_car_percent)
            h_truck = int(hour_vehicles * h_truck_percent)
            h_bus = int(hour_vehicles * h_bus_percent)
            
            # Điều chỉnh nếu có sai số
            actual_h_total = h_motorcycle + h_car + h_truck + h_bus
            if actual_h_total != hour_vehicles:
                h_motorcycle += (hour_vehicles - actual_h_total)
            
            # Thêm dữ liệu giờ này vào mảng
            hour_data = {
                "hour": f"{hour_of_day:02d}:00",
                "hourType": hour_type,
                "totalVehicles": hour_vehicles,
                "vehicleTypes": {
                    "motorcycle": {
                        "count": h_motorcycle,
                        "percentage": round(h_motorcycle / hour_vehicles * 100, 1) if hour_vehicles > 0 else 0
                    },
                    "car": {
                        "count": h_car,
                        "percentage": round(h_car / hour_vehicles * 100, 1) if hour_vehicles > 0 else 0
                    },
                    "truck": {
                        "count": h_truck,
                        "percentage": round(h_truck / hour_vehicles * 100, 1) if hour_vehicles > 0 else 0
                    },
                    "bus": {
                        "count": h_bus,
                        "percentage": round(h_bus / hour_vehicles * 100, 1) if hour_vehicles > 0 else 0
                    }
                }
            }
            vehicle_data["hourlyData"].append(hour_data)
            
            # Tăng thời gian lên 1 giờ
            current_hour = current_hour + timedelta(hours=1)
            
        return vehicle_data
        
    except Exception as e:
        return {"error": str(e)}