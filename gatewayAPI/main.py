from fastapi import FastAPI, Request, Depends, HTTPException
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

@app.post("/users/login")
async def login(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{USER_SERVICE_URL}/login", json={
            "email": body.get("email"),
            "password": body.get("password")
        })

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_data = response.json()
    access_token = create_access_token(data={"sub": user_data["email"]}, expires_delta=timedelta(minutes=60))
    return {"access_token": access_token, "token_type": "bearer", "user": user_data}

@app.post("/users/register")
async def register(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{USER_SERVICE_URL}/register", json={
            "fullname": body.get("fullname"),
            "email": body.get("email"),
            "password": body.get("password")
        })
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Register failed")
    return {"message": "Register success!"}

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/{service}/{path:path}")
async def get_proxy(service: str, path: str, request: Request, _=Depends(rate_limit)):
    return await forward_request(service, f"/{path}", request)

@app.post("/{service}/{path:path}")
async def post_proxy(service: str, path: str, request: Request, _=Depends(rate_limit)):
    return await forward_request(service, f"/{path}", request)



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
