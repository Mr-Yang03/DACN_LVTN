from fastapi import FastAPI, Request, Depends, HTTPException, Query, Form
from forwarder import forward_request
from auth import verify_token, create_access_token
from rate_limiter import rate_limit
from monitoring import setup_monitoring
from datetime import timedelta
import httpx
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from typing import List, Dict ##


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_monitoring(app)

from config import HOST_IP
USER_SERVICE_URL = f"http://{HOST_IP}:8001"
TRAFFIC_SERVICE_URL = f"http://{HOST_IP}:8002"
FEEDBACK_SERVICE_URL = f"http://{HOST_IP}:8003"
NEWS_SERVICE_URL = f"http://{HOST_IP}:8004"
AGENT_SERVICE_URL = f"http://{HOST_IP}:8005"  # Assuming Agent service runs on port 8005

CAMERA_SERVICE_URL = f"http://{HOST_IP}:8009"
USERBOARD_SERVICE_URL = f"http://{HOST_IP}:8010"  # hoặc URL tương ứng nếu khác


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

@app.get("/users/check_username/{username}")
async def check_username(username: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{USER_SERVICE_URL}/check-username/{username}",
            params={"username": username}
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to check username")
    return response.json()

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
                "avatar": ""
            },
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Register failed")
    return {"message": "Register success!"}

@app.put("/users/update")
async def update_user(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{USER_SERVICE_URL}/update",
            params={"account_id": body.get("account_id")},
            json={
                "full_name": body.get("full_name"),
                "date_of_birth": body.get("date_of_birth"),
                "phone_number": body.get("phone_number"),
                "license_number": body.get("license_number"),
            },
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Update failed")
    return response.json()

@app.post("/avatar/upload")
async def upload_avatar(request: Request):
    form_data = await request.form()
    file = form_data.get("file")
    
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Đọc nội dung của file
    content = await file.read()
    
    async with httpx.AsyncClient() as client:
        files = {"file": (file.filename, content, file.content_type)}
        response = await client.post(
            f"{USER_SERVICE_URL}/avatar/upload",
            files=files
        )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to upload image")

    return response.json()

@app.put("/account/update_avt")
async def update_avatar(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{USER_SERVICE_URL}/avatar/update",
            params={"account_id": body.get("account_id")},
            json={
                "fileUrl": body.get("avatar"),
            },
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Update failed")
    return response.json()

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

@app.get("/traffic/camera/{camera_id}/speed")
async def get_camera_speed(
    camera_id: str,
    start_time: str = Query(...),
    end_time: str = Query(...),
    _=Depends(rate_limit),
):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TRAFFIC_SERVICE_URL}/camera/{camera_id}/speed",
            params={"start_time": start_time, "end_time": end_time}
        )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch camera speed data")

    return response.json()

@app.get("/traffic/camera/{camera_id}/vehicle-types")
async def get_vehicle_types(
    camera_id: str,
    start_time: str = Query(...),
    end_time: str = Query(...),
    _=Depends(rate_limit),
):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TRAFFIC_SERVICE_URL}/camera/{camera_id}/vehicle-types",
            params={"start_time": start_time, "end_time": end_time}
        )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch vehicle types data")

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
@app.get("/feedback/all_items")
async def get_all_feedback():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{FEEDBACK_SERVICE_URL}/feedback/all")

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch feedback data")

    return response.json()

@app.get("/feedback/{feedback_id}")
async def get_feedback_by_id(feedback_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{FEEDBACK_SERVICE_URL}/feedback/item/{feedback_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Feedback not found")

    return response.json()

@app.get("/feedback/user/{username}")
async def get_feedback_by_username(username: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{FEEDBACK_SERVICE_URL}/feedback/{username}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Feedback item not found")

    return response.json()

@app.get("/feedback/filter")
async def filter_feedback(
    severity: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
):
    params = {}
    if severity:
        params["severity"] = severity
    if type:
        params["type"] = type
    if start_date:
        params["start_date"] = start_date
    if end_date:
        params["end_date"] = end_date

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{FEEDBACK_SERVICE_URL}/feedback/filter", params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to filter feedback")

    return response.json()

@app.post("/feedback/item")
async def create_feedback(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{FEEDBACK_SERVICE_URL}/feedback/items", json=body)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to submit feedback")

    return response.json()

@app.post("/feedback/upload")
async def upload_feedback_image(request: Request):
    form_data = await request.form()
    
    # Check if any files were provided
    if not form_data.getlist("attachments"):
        raise HTTPException(status_code=400, detail="No attachments provided")
    
    attachments = []
    
    # Process each file in the form data
    for file in form_data.getlist("attachments"):
        if file.filename:
            # Read file content
            content = await file.read()
            # Add to files dictionary with unique keys for each file
            attachments.append(("files", (file.filename, content, file.content_type)))
    
    if not attachments:
        raise HTTPException(status_code=400, detail="No valid files found")
    
    # Send all files to feedback service
    async with httpx.AsyncClient(timeout=60.0) as client:  # Increase timeout to 60 seconds
        response = await client.post(
            f"{FEEDBACK_SERVICE_URL}/feedback/upload",
            files=attachments
        )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to upload attachments")

    return response.json()

@app.put("/feedback/{feedback_id}")
async def update_feedback(feedback_id: str, request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{FEEDBACK_SERVICE_URL}/feedback/{feedback_id}", json=body)

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Feedback not found or failed to update")

    return response.json()

@app.delete("/feedback/{feedback_id}")
async def delete_feedback(feedback_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{FEEDBACK_SERVICE_URL}/feedback/{feedback_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Feedback not found or failed to delete")

    return response.json()

@app.post("/feedback/count-by")
async def proxy_feedback_count(payload: List[Dict[str, str]]):

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{FEEDBACK_SERVICE_URL}/feedback/count-by",
            json=payload
        )
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

# Userboard Service Routes

@app.get("/userboard/ub")
async def proxy_get_all_users():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{USERBOARD_SERVICE_URL}/userboard/ub")
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch users")
    return {"status": "success", "data": response.json()}

@app.get("/userboard/ub/{user_id}")
async def proxy_get_user(user_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{USERBOARD_SERVICE_URL}/userboard/ub/{user_id}")
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="User not found")
    return {"status": "success", "data": response.json()}

@app.post("/userboard/ub")
async def proxy_create_user(request: Request):
    data = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{USERBOARD_SERVICE_URL}/userboard/ub", json=data)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to create user")
    return {"status": "success", "data": response.json()}

@app.put("/userboard/ub/{user_id}")
async def proxy_update_user(user_id: str, request: Request):
    data = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{USERBOARD_SERVICE_URL}/userboard/ub/{user_id}", json=data)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to update user")
    return {"status": "success", "data": response.json()}

@app.delete("/userboard/ub/{user_id}")
async def proxy_delete_user(user_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{USERBOARD_SERVICE_URL}/userboard/ub/{user_id}")
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to delete user")
    return {"status": "success", "message": "User deleted successfully"}
## change pass
@app.put("/userboard/ub/reset-password/{account_id}")
async def proxy_reset_password(account_id: str, request: Request):
    new_password = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{USERBOARD_SERVICE_URL}/userboard/ub/reset-password/{account_id}",
            json=new_password
        )
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to reset password")
    return {"status": "success", "message": "Password reset successfully"}


@app.post("/admin/login")
async def admin_login(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{USER_SERVICE_URL}/admin/login",
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

@app.post("/admin/register")
async def admin_register(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{USER_SERVICE_URL}/admin/register",
            json={
                "username": body.get("username"),
                "password": body.get("password"),
                "full_name": body.get("full_name"),
                "date_of_birth": body.get("date_of_birth"),
                "phone_number": body.get("phone_number"),
                "citizen_id": body.get("citizen_id"),
            },
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Register failed")
    return {"message": "Admin registration successful!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
