from fastapi import FastAPI, Request, Depends
from forwarder import forward_request
from auth import verify_token
from rate_limiter import rate_limit
from monitoring import setup_monitoring

app = FastAPI()

# Cấu hình monitoring
setup_monitoring(app)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/{service}/{path:path}")
# async def get_proxy(service: str, path: str, request: Request, token: dict = Depends(verify_token), _=Depends(rate_limit)):
async def get_proxy(service: str, path: str, request: Request, _=Depends(rate_limit)):
    return await forward_request(service, f"/{path}", request)

@app.post("/{service}/{path:path}")
async def post_proxy(service: str, path: str, request: Request, _=Depends(rate_limit)):
    return await forward_request(service, f"/{path}", request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
