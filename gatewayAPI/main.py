from fastapi import FastAPI, Request, Depends, HTTPException, Query
from forwarder import forward_request
from auth import verify_token, create_access_token
from rate_limiter import rate_limit
from monitoring import setup_monitoring
from datetime import timedelta
import httpx
from fastapi.middleware.cors import CORSMiddleware

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

@app.post("/users/login")
async def login(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{USER_SERVICE_URL}/login",
            json={"email": body.get("email"), "password": body.get("password")},
        )

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_data = response.json()
    access_token = create_access_token(
        data={"sub": user_data["email"]}, expires_delta=timedelta(minutes=60)
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user_data}


@app.post("/users/register")
async def register(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{USER_SERVICE_URL}/register",
            json={
                "fullname": body.get("fullname"),
                "email": body.get("email"),
                "password": body.get("password"),
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

# @app.post("/feedback")
# async def submit_feedback(request: Request, token: str = Depends(verify_token)):
#     body = await request.json()
#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             f"{FEEDBACK_SERVICE_URL}/feedback",
#             json={
#                 "user_id": token["sub"],
#                 "message": body.get("message"),
#                 "rating": body.get("rating"),
#             },
#         )
#     if response.status_code != 200:
#         raise HTTPException(status_code=400, detail="Feedback submission failed")
#     return {"message": "Feedback submitted successfully!"}

@app.get("/feedback/all_items")
async def get_feedback(token: str = Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{FEEDBACK_SERVICE_URL}/items"
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch feedback")
    return response.json()

@app.get("/feedback/items/processed")
async def get_processed_feedback(token: str = Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{FEEDBACK_SERVICE_URL}/items/processed"
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch processed feedback")
    return response.json()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=9000)
