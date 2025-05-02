from fastapi import APIRouter, Query, Body, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import httpx
from connection import get_database
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
import os
import shutil
from fastapi.responses import JSONResponse

news_router = APIRouter()

db = get_database()
news_collection = db["Items"]

# Admin news endpoints
@news_router.get("/admin/news", response_model=List[dict])
async def get_all_news():
    """
    Retrieve all news articles.
    Only accessible by admin users.
    """
    cursor = news_collection.find().sort("timestamp", -1)
    news_list = []
    
    for news in cursor:
        news["_id"] = str(news["_id"])
        news_list.append(news)
        
    return news_list

@news_router.get("/admin/news/{news_id}", response_model=dict)
async def get_news_by_id(news_id: str):
    """
    Retrieve a specific news article by its ID.
    Only accessible by admin users.
    """
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(news_id):
            raise HTTPException(status_code=400, detail="Invalid news ID format")
            
        news = news_collection.find_one({"_id": ObjectId(news_id)})
        
        if not news:
            raise HTTPException(status_code=404, detail="News not found")
            
        news["_id"] = str(news["_id"])
        return news
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@news_router.post("/admin/news")
async def create_news(news: dict = Body(...)):
    """
    Create a new news article.
    Only accessible by admin users.
    Required fields: title, content, image_url
    Optional fields: status (default: "draft"), category (default: "general"), 
                    author, tags (default: []), featured (default: False),
                    publishDate, publishTime, summary
    """
    try:
        # Validate required fields
        required_fields = ["title", "content", "image_url"]
        for field in required_fields:
            if field not in news:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # Set default values for optional fields
        if "status" not in news:
            news["status"] = "draft"
        
        if "category" not in news:
            news["category"] = "general"
            
        if "tags" not in news:
            news["tags"] = []
            
        if "featured" not in news:
            news["featured"] = False
            
        if "author" not in news:
            news["author"] = "Ẩn danh"
            
        if "summary" not in news:
            news["summary"] = ""
            
        # Add metadata
        news["created_at"] = datetime.utcnow()
        news["updated_at"] = datetime.utcnow()
        
        # Set timestamp for sorting based on publishDate and publishTime
        if "publishDate" in news and "publishTime" in news:
            try:
                day, month, year = map(int, news["publishDate"].split('/'))
                hour, minute = map(int, news["publishTime"].split(':'))
                news["timestamp"] = datetime(year, month, day, hour, minute)
            except (ValueError, AttributeError):
                # If date format is invalid, use current time
                news["timestamp"] = datetime.utcnow()
        else:
            # If publishDate or publishTime not provided, use current time
            news["timestamp"] = datetime.utcnow()
        
        # Insert into database
        result = news_collection.insert_one(news)
        
        # Return created news with ID
        created_news = news.copy()
        created_news["_id"] = str(result.inserted_id)
        
        return created_news
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@news_router.put("/admin/news/{news_id}", response_model=dict)
async def update_news(news_id: str, updated_news: dict = Body(...)):
    """
    Update an existing news article.
    Only accessible by admin users.
    """
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(news_id):
            raise HTTPException(status_code=400, detail="Invalid news ID format")
            
        # Check if news exists
        existing_news = news_collection.find_one({"_id": ObjectId(news_id)})
        if not existing_news:
            raise HTTPException(status_code=404, detail="News not found")
            
        # Update the updated_at timestamp
        updated_news["updated_at"] = datetime.utcnow()
        
        # Update timestamp if publishDate or publishTime changed
        if ("publishDate" in updated_news or "publishTime" in updated_news):
            # Get latest values, preferring updated values over existing ones
            publish_date = updated_news.get("publishDate", existing_news.get("publishDate"))
            publish_time = updated_news.get("publishTime", existing_news.get("publishTime"))
            
            if publish_date and publish_time:
                try:
                    day, month, year = map(int, publish_date.split('/'))
                    hour, minute = map(int, publish_time.split(':'))
                    updated_news["timestamp"] = datetime(year, month, day, hour, minute)
                except (ValueError, AttributeError):
                    # Keep existing timestamp if date format is invalid
                    if "timestamp" in existing_news:
                        updated_news["timestamp"] = existing_news["timestamp"]
        
        # Update the news in the database
        result = news_collection.update_one(
            {"_id": ObjectId(news_id)},
            {"$set": updated_news}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="News update failed")
            
        # Retrieve and return the updated news
        updated_doc = news_collection.find_one({"_id": ObjectId(news_id)})
        updated_doc["_id"] = str(updated_doc["_id"])
        
        return updated_doc
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@news_router.delete("/admin/news/{news_id}")
async def delete_news(news_id: str):
    """
    Delete a news article.
    Only accessible by admin users.
    """
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(news_id):
            raise HTTPException(status_code=400, detail="Invalid news ID format")
            
        # Delete the news
        result = news_collection.delete_one({"_id": ObjectId(news_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="News not found")
            
        return None
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Public news endpoints
@news_router.get("/news", response_model=List[dict])
async def get_public_news():
    """
    Retrieve all published news articles.
    Accessible by all users.
    """
    cursor = news_collection.find({"status": "published"}).sort("timestamp", -1)
    news_list = []
    
    for news in cursor:
        news["_id"] = str(news["_id"])
        news_list.append(news)
        
    return news_list

@news_router.get("/news/featured", response_model=List[dict])
async def get_featured_news(limit: Optional[int] = Query(None, description="Number of featured news to return")):
    """
    Retrieve featured news articles.
    Accessible by all users.
    Optional query parameter: limit - Number of items to return
    """
    try:
        # Find published news that are marked as featured
        query = {
            "status": "published", 
            "featured": True
        }
        
        # First try to get explicitly marked featured news
        if limit:
            cursor = news_collection.find(query).sort("timestamp", -1).limit(limit)
        else:
            cursor = news_collection.find(query).sort("timestamp", -1)
        
        news_list = []
        for news in cursor:
            news["_id"] = str(news["_id"])
            news_list.append(news)
        
        # If we don't have enough featured news, get the most recent published news
        if limit and len(news_list) < limit:
            additional_needed = limit - len(news_list)
            # Get IDs of news we already have to exclude them
            existing_ids = [ObjectId(news["_id"]) for news in news_list]
            
            additional_cursor = news_collection.find({
                "status": "published",
                "_id": {"$nin": existing_ids}
            }).sort("timestamp", -1).limit(additional_needed)
            
            for news in additional_cursor:
                news["_id"] = str(news["_id"])
                news_list.append(news)
        
        return news_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@news_router.get("/news/category/{category}", response_model=List[dict])
async def get_news_by_category(category: str):
    """
    Retrieve all published news articles by category.
    Accessible by all users.
    """
    cursor = news_collection.find({"status": "published", "category": category}).sort("timestamp", -1)
    news_list = []
    
    for news in cursor:
        news["_id"] = str(news["_id"])
        news_list.append(news)
        
    return news_list

@news_router.get("/news/{news_id}", response_model=dict)
async def get_public_news_by_id(news_id: str):
    """
    Retrieve a specific published news article by its ID.
    Accessible by all users.
    """
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(news_id):
            raise HTTPException(status_code=400, detail="Invalid news ID format")
            
        news = news_collection.find_one({"_id": ObjectId(news_id)})
        
        if not news or news.get("status") != "published":
            raise HTTPException(status_code=404, detail="News not found")
            
        # Increment view count
        news_collection.update_one(
            {"_id": ObjectId(news_id)},
            {"$inc": {"views": 1}}
        )
        
        # Get updated document with incremented view count
        updated_news = news_collection.find_one({"_id": ObjectId(news_id)})
        updated_news["_id"] = str(updated_news["_id"])
        
        return updated_news
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@news_router.post("/news/upload")
async def upload_news_image(file: UploadFile = File(...)):
    """
    Upload an image for a news article.
    """
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.getcwd(), "uploads")
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            
        # Generate unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return file URL
        # Note: In a production environment, you might want to use a CDN or cloud storage
        file_url = f"/uploads/{unique_filename}"
        
        return {"file_url": file_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

