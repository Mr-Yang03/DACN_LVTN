import logging
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

logging.basicConfig(filename="gateway.log", level=logging.INFO)

def setup_monitoring(app: FastAPI):
    """Thiết lập Prometheus Monitoring"""
    Instrumentator().instrument(app).expose(app)
    
    @app.middleware("http")
    async def log_requests(request, call_next):
        logging.info(f"Request: {request.method} {request.url}")
        response = await call_next(request)
        return response
