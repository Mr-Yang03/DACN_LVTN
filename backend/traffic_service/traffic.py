# app/main.py
from fastapi import APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
from connection import get_database

traffic_router = APIRouter()

db = get_database()
user_collection = db["Cameras"]

@traffic_router.get("/status")
async def get_traffic_data(
    WSlat: float = Query(...),
    WSlng: float = Query(...),
    NElat: float = Query(...),
    NElng: float = Query(...),
    level: int = 0
):
    url = (
        "https://api.bktraffic.com/api/traffic-status/get-status-v3"
        f"?WSlat={WSlat}&WSlng={WSlng}&NElat={NElat}&NElng={NElng}&level={level}"
    )

    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        res.raise_for_status()
        return res.json()

@traffic_router.get("/camera")
async def get_camera_location():
    cameras = user_collection.find().to_list(length=None)

    info = [{
        "Title": camera["Title"],
        "Location": camera["Location"],
        "SnapshotUrl": camera["SnapshotUrl"],
        "DisplayName": camera["DisplayName"],

    } for camera in cameras]

    return {"cameras": info}