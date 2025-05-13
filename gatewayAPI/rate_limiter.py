import redis.asyncio as redis
from fastapi import Request, HTTPException
from config import HOST_IP

redis_client = redis.Redis(host=HOST_IP, port=6379, decode_responses=True)

async def rate_limit(request: Request):
    """Giới hạn số request từ mỗi IP"""
    client_ip = request.client.host
    key = f"rate_limit:{client_ip}"
    
    count = await redis_client.incr(key)
    if count == 1:
        await redis_client.expire(key, 60)  # Reset sau 60 giây
    
    if count > 100:
        raise HTTPException(status_code=429, detail="Too many requests")
