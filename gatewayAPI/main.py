from fastapi import FastAPI, Request, Depends, HTTPException, Query, Form
from forwarder import forward_request
from auth import verify_token, create_access_token
from rate_limiter import rate_limit
from monitoring import setup_monitoring
from datetime import timedelta
import httpx
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_monitoring(app)

USER_SERVICE_URL = "http://localhost:8001"
TRAFFIC_SERVICE_URL = "http://localhost:8002"
FEEDBACK_SERVICE_URL = "http://localhost:8003"
NEWS_SERVICE_URL = "http://localhost:8004"
AGENT_SERVICE_URL = "http://localhost:8005"

CAMERA_SERVICE_URL = "http://localhost:8009"

@app.post("/users/login")
async def login(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{USER_SERVICE_URL}/login",
            json={"username": body.get("username"), "password": body.get("password")},
        )

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_data = response.json()
    access_token = create_access_token(
        data={
            "sub": user_data["username"],
            "account_type": user_data["account_type"]
        }, 
        expires_delta=timedelta(minutes=60)
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user_data}


@app.post("/users/register")
async def register(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{USER_SERVICE_URL}/register",
            json={
                "username": body.get("username"),
                "password": body.get("password"),
                "full_name": body.get("full_name"),
                "date_of_birth": body.get("date_of_birth"),
                "phone_number": body.get("phone_number"),
                "license_number": body.get("license_number"),
            },
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Register failed")
    return {"message": "Register success!"}


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/traffic/status")
async def get_traffic_data_from_service(
    WSlat: float = Query(...),
    WSlng: float = Query(...),
    NElat: float = Query(...),
    NElng: float = Query(...),
    level: int = 0,
    _=Depends(rate_limit),
):
    params = {
        "WSlat": WSlat,
        "WSlng": WSlng,
        "NElat": NElat,
        "NElng": NElng,
        "level": level,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{TRAFFIC_SERVICE_URL}/status", params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch traffic data")

    return response.json()


@app.get("/traffic/camera")
async def get_cameras():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{TRAFFIC_SERVICE_URL}/camera")

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch camera data")

    return response.json()

# News Service Routes
@app.get("/news")
async def get_all_news():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWS_SERVICE_URL}/news")

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch news data")

    return response.json()

@app.get("/news/featured")
async def get_featured_news(limit: Optional[int] = None):
    params = {}
    if limit is not None:
        params["limit"] = limit
        
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWS_SERVICE_URL}/news/featured", params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch featured news")

    return response.json()

@app.get("/news/category/{category}")
async def get_news_by_category(category: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWS_SERVICE_URL}/news/category/{category}")

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch news by category")

    return response.json()

@app.get("/news/{news_id}")
async def get_news_by_id(news_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWS_SERVICE_URL}/news/{news_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="News not found")

    return response.json()

@app.post("/news")
async def create_news(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{NEWS_SERVICE_URL}/news", json=body)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to create news")

    return response.json()

@app.put("/news/{news_id}")
async def update_news(news_id: str, request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{NEWS_SERVICE_URL}/news/{news_id}", json=body)

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="News not found or failed to update")

    return response.json()

@app.delete("/news/{news_id}")
async def delete_news(news_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{NEWS_SERVICE_URL}/news/{news_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="News not found or failed to delete")

    return response.json()

# Admin News API Routes
@app.get("/admin/news")
async def get_all_admin_news():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWS_SERVICE_URL}/admin/news")

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch admin news data")

    return response.json()

@app.get("/admin/news/{news_id}")
async def get_admin_news_by_id(news_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWS_SERVICE_URL}/admin/news/{news_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="News not found")

    return response.json()

@app.post("/admin/news")
async def create_admin_news(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{NEWS_SERVICE_URL}/admin/news", json=body)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to create news")

    return response.json()

@app.put("/admin/news/{news_id}")
async def update_admin_news(news_id: str, request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{NEWS_SERVICE_URL}/admin/news/{news_id}", json=body)

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="News not found or failed to update")

    return response.json()

@app.delete("/admin/news/{news_id}")
async def delete_admin_news(news_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{NEWS_SERVICE_URL}/admin/news/{news_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="News not found or failed to delete")

    return response.json()

# Image Upload for News
@app.post("/news/upload")
async def upload_news_image(request: Request):
    form_data = await request.form()
    file = form_data.get("file")
    
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Đọc nội dung của file
    content = await file.read()
    
    async with httpx.AsyncClient() as client:
        files = {"file": (file.filename, content, file.content_type)}
        response = await client.post(
            f"{NEWS_SERVICE_URL}/news/upload",
            files=files
        )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to upload image")

    return response.json()

# Feedback Service Routes
@app.get("/feedback")
async def get_all_feedback():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{FEEDBACK_SERVICE_URL}/feedback")

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch feedback data")

    return response.json()

@app.post("/feedback")
async def create_feedback(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{FEEDBACK_SERVICE_URL}/feedback", json=body)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to submit feedback")

    return response.json()

@app.get("/feedback/{feedback_id}")
async def get_feedback_by_id(feedback_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{FEEDBACK_SERVICE_URL}/feedback/{feedback_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Feedback not found")

    return response.json()

# Agent Service Routes (Chatbot)
@app.post("/chatbot/")
async def chat_with_agent(prompt: str = Form(...)):
    async with httpx.AsyncClient(timeout=60.0) as client:  # Set timeout to 60 seconds
        try:
            response = await client.post(
                f"{AGENT_SERVICE_URL}/chatbot/",
                data={"prompt": prompt},
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code, 
                    detail="Failed to get response from chatbot service"
                )
                
            return response.json()
        except httpx.RequestError as e:
            # Kiểm tra nếu lỗi là do timeout
            if isinstance(e, httpx.TimeoutException):
                raise HTTPException(
                    status_code=504, 
                    detail="Chatbot service request timed out. The operation took too long to complete."
                )
            else:
                raise HTTPException(
                    status_code=503, 
                    detail="Chatbot service unavailable. Please try again later."
                )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"An unexpected error occurred: {str(e)}"
            )

# Camera Routes

@app.get("/api/cameras")
async def proxy_get_all_cameras():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{CAMERA_SERVICE_URL}/api/cameras")
    return response.json()

@app.get("/api/cameras/{camera_id}")
async def proxy_get_camera_by_id(camera_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{CAMERA_SERVICE_URL}/api/cameras/{camera_id}")
    return response.json()

@app.post("/api/cameras")
async def proxy_create_camera(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{CAMERA_SERVICE_URL}/api/cameras", json=body)
    return response.json()

@app.put("/api/cameras/{camera_id}")
async def proxy_update_camera(camera_id: str, request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{CAMERA_SERVICE_URL}/api/cameras/{camera_id}", json=body)
    return response.json()

@app.delete("/api/cameras/{camera_id}")
async def proxy_delete_camera(camera_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{CAMERA_SERVICE_URL}/api/cameras/{camera_id}")
    return response.json()

@app.post("/api/cameras/{camera_id}/position")
async def proxy_update_camera_position(camera_id: str, lat: float = Form(...), lng: float = Form(...)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{CAMERA_SERVICE_URL}/api/cameras/{camera_id}/position",
            params={"lat": lat, "lng": lng}
        )
    return response.json()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=9000)
