import httpx
from fastapi import Request, HTTPException
from config import SERVICES
from cache import get_cached_response, set_cached_response

async def forward_request(service: str, path: str, request: Request):
    """Chuyển tiếp request đến microservices với cache"""
    if service not in SERVICES:
        raise HTTPException(status_code=404, detail="Service not found")

    url = f"{SERVICES[service]}{path}"
    cache_key = f"{service}:{path}"
    
    # Kiểm tra cache trước khi gửi request
    cached_response = await get_cached_response(cache_key)
    if cached_response:
        return cached_response

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=url,
            headers=request.headers,
            params=request.query_params,
            json=await request.json() if request.method in ["POST", "PUT"] else None,
        )

        await set_cached_response(cache_key, response.text)
        return response.json()
