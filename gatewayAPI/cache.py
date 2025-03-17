import redis.asyncio as redis

redis_client = redis.Redis(host="localhost", port=6379, decode_responses=True)

async def get_cached_response(key: str):
    """Lấy dữ liệu từ cache"""
    return await redis_client.get(key)

async def set_cached_response(key: str, value: str, ttl: int = 60):
    """Lưu dữ liệu vào cache với TTL"""
    await redis_client.setex(key, ttl, value)
