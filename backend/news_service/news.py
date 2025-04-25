from fastapi import APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
from connection import get_database

traffic_router = APIRouter()

db = get_database()
user_collection = db["News"]

@news_router.get("/all_news")
async def get_news_data(
    
):
    