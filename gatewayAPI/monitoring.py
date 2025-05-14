import logging
import time
from fastapi import FastAPI, Request, Response
from prometheus_fastapi_instrumentator import Instrumentator
import redis.asyncio as redis
from collections import defaultdict
from datetime import datetime, timedelta
import json
from config import HOST_IP

# Khởi tạo Redis client
redis_client = redis.Redis(host=HOST_IP, port=6379, decode_responses=True)

logging.basicConfig(filename="gateway.log", level=logging.INFO)

# Các biến để lưu trữ metrics trong bộ nhớ
request_counts = defaultdict(int)
service_counts = defaultdict(int)
status_counts = defaultdict(int)
endpoint_counts = defaultdict(int)
response_times = defaultdict(list)

async def get_metrics_data():
    """Lấy dữ liệu metrics từ Redis và bộ nhớ"""
    # Lấy tổng số request
    total_requests = await redis_client.get("total_requests") or "0"
    
    # Lấy số request theo service
    service_data = {}
    for service in ["users", "traffic", "news", "feedback", "chatbot", "camera"]:
        count = await redis_client.get(f"service:{service}:count") or "0"
        service_data[service] = int(count)
    
    # Lấy số request theo status code
    status_data = {}
    for status in ["200", "400", "401", "403", "404", "500"]:
        count = await redis_client.get(f"status:{status}:count") or "0"
        status_data[status] = int(count)
    
    # Lấy top endpoints
    top_endpoints = []
    endpoints = await redis_client.zrevrange("endpoints", 0, 9, withscores=True)
    for endpoint, count in endpoints:
        top_endpoints.append({"path": endpoint, "count": int(count)})
    
    # Lấy dữ liệu theo thời gian
    time_series = []
    now = datetime.now()
    for i in range(24):
        time_key = (now - timedelta(hours=i)).strftime("%Y-%m-%d-%H")
        count = await redis_client.get(f"requests:hourly:{time_key}") or "0"
        time_series.append({
            "time": (now - timedelta(hours=i)).strftime("%H:00"),
            "count": int(count)
        })
    time_series.reverse()
    
    # Lấy thời gian phản hồi trung bình
    avg_time = await redis_client.get("avg_response_time") or "0"
    
    return {
        "total_requests": int(total_requests),
        "services": service_data,
        "status_codes": status_data,
        "top_endpoints": top_endpoints,
        "time_series": time_series,
        "avg_response_time": float(avg_time)
    }

def setup_monitoring(app: FastAPI):
    """Thiết lập Prometheus Monitoring và custom metrics"""
    Instrumentator().instrument(app).expose(app)
    
    @app.middleware("http")
    async def metrics_middleware(request: Request, call_next):
        # Lấy service từ path
        path = request.url.path
        service = path.split("/")[1] if len(path.split("/")) > 1 else "root"
        
        # Bỏ qua request đến /metrics/dashboard
        if path == "/metrics/dashboard":
            return await call_next(request)
        
        # Đo thời gian phản hồi
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Lưu thông tin request vào Redis
        await redis_client.incr("total_requests")
        await redis_client.incr(f"service:{service}:count")
        await redis_client.incr(f"status:{response.status_code}:count")
        
        # Lưu endpoint count vào sorted set
        await redis_client.zincrby("endpoints", 1, path)
        
        # Lưu theo thời gian
        time_key = datetime.now().strftime("%Y-%m-%d-%H")
        await redis_client.incr(f"requests:hourly:{time_key}")
        
        # Cập nhật thời gian phản hồi trung bình
        current_avg = float(await redis_client.get("avg_response_time") or "0")
        current_count = int(await redis_client.get("total_requests") or "1")
        new_avg = ((current_avg * (current_count - 1)) + process_time) / current_count
        await redis_client.set("avg_response_time", str(new_avg))
        
        # Lưu vào log
        logging.info(f"Request: {request.method} {path} | Service: {service} | Status: {response.status_code} | Time: {process_time:.4f}s")
        
        return response
    
    # Thêm endpoint cho metrics dashboard
    @app.get("/metrics/dashboard")
    async def get_dashboard_metrics():
        return await get_metrics_data()
