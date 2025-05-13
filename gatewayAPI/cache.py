import redis.asyncio as redis
from config import HOST_IP

redis_client = redis.Redis(host=HOST_IP, port=6379, decode_responses=True)

async def get_cached_response(key: str):
    """Lấy dữ liệu từ cache"""
    return await redis_client.get(key)

async def set_cached_response(key: str, value: str, ttl: int = 60):
    """Lưu dữ liệu vào cache với TTL"""
    await redis_client.setex(key, ttl, value)
