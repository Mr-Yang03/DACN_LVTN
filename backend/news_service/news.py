from fastapi import APIRouter, Query, Body
from fastapi.middleware.cors import CORSMiddleware
import httpx
from connection import get_database
from datetime import datetime
from bson import ObjectId

news_router = APIRouter()

db = get_database()
user_collection = db["Items"]

@news_router.get("/all_news")
async def get_news_data():
    '''
    Get all news items from the database, sorted by severity and date.
    The severity is sorted in the order of "hot" < "normal", and the date is sorted in descending order.
    '''
    pipeline = [
        {
            "$addFields": {
                "severityOrder": {
                    "$switch": {
                        "branches": [
                            {"case": {"$eq": ["$severity", "hot"]}, "then": 1},
                            {"case": {"$eq": ["$severity", "normal"]}, "then": 2}
                        ],
                        "default": 3
                    }
                },
                # Convert date and time strings to a proper date object for sorting
                "dateTimeObj": {
                    "$dateFromString": {
                        "dateString": {"$concat": ["$date", "T", "$time"]},
                        "format": "%Y-%m-%dT%H:%M"
                    }
                }
            }
        },
        {"$sort": {"severityOrder": 1, "dateTimeObj": -1}},  # 1 for ascending, -1 for descending
        {
            "$project": {
                "severityOrder": 0,  
                "dateTimeObj": 0    
            }
        }
    ]

    all_news_items = await user_collection.aggregate(pipeline).to_list(length=None)

    return {
        "status": "success",
        "data": all_news_items,
    }

@news_router.get("/all_user_news")
async def get_news_data():
    '''
    Get all news items from the database with isProcessed = true and isDeleted = false, sorted by severity and date.
    The severity is sorted in the order of "hot" < "normal", and the date is sorted in descending order.
    '''
    pipeline = [
        # First filter by isDeleted=false and isProcessed=true
        {
            "$match": {
                "isDeleted": False,
                "isProcessed": True
            }
        },
        {
            "$addFields": {
                "severityOrder": {
                    "$switch": {
                        "branches": [
                            {"case": {"$eq": ["$severity", "hot"]}, "then": 1},
                            {"case": {"$eq": ["$severity", "normal"]}, "then": 2}
                        ],
                        "default": 3
                    }
                },
                # Convert date and time strings to a proper date object for sorting
                "dateTimeObj": {
                    "$dateFromString": {
                        "dateString": {"$concat": ["$date", "T", "$time"]},
                        "format": "%Y-%m-%dT%H:%M"
                    }
                }
            }
        },
        {"$sort": {"severityOrder": 1, "dateTimeObj": -1}},  # 1 for ascending, -1 for descending
        {
            "$project": {
                "severityOrder": 0,  
                "dateTimeObj": 0    
            }
        }
    ]
    
    all_news_items = await user_collection.aggregate(pipeline).to_list(length=None)
    
    return {
        "status": "success",
        "data": all_news_items,
    }

@news_router.get("/news_by_id")
async def get_news_by_id(id: str):
    '''
    Get news item by id from the database.
    '''
    news_item = await user_collection.find_one({"_id": id})
    
    if not news_item:
        return {
            "status": "error",
            "message": "News item not found"
        }
    
    return {
        "status": "success",
        "data": news_item,
    }

@news_router.get("/news_by_severity")
async def get_news_by_severity(severity: str = Query(..., enum=["hot", "normal"])):
    '''
    Get news items by severity from the database.
    '''
    pipeline = [
        {
            "$match": {
                "severity": severity,
                "isDeleted": False,
                "isProcessed": True
            }
        },
        {
            "$addFields": {
                "severityOrder": {
                    "$switch": {
                        "branches": [
                            {"case": {"$eq": ["$severity", "hot"]}, "then": 1},
                            {"case": {"$eq": ["$severity", "normal"]}, "then": 2}
                        ],
                        "default": 3
                    }
                },
                # Convert date and time strings to a proper date object for sorting
                "dateTimeObj": {
                    "$dateFromString": {
                        "dateString": {"$concat": ["$date", "T", "$time"]},
                        "format": "%Y-%m-%dT%H:%M"
                    }
                }
            }
        },
        {"$sort": {"severityOrder": 1, "dateTimeObj": -1}},  # 1 for ascending, -1 for descending
        {
            "$project": {
                "severityOrder": 0,  
                "dateTimeObj": 0    
            }
        }
    ]
    
    news_items = await user_collection.aggregate(pipeline).to_list(length=None)
    
    return {
        "status": "success",
        "data": news_items,
    }

@news_router.get("/news_by_date_range")
async def get_news_by_date_range(
    start_date: str = Query(..., description="YYYY-MM-DD"),
    end_date: str = Query(..., description="YYYY-MM-DD")
):
    '''
    Filter news items by date range.
    '''
    pipeline = [
        {
            "$match": {
                "date": {"$gte": start_date, "$lte": end_date},
                "isDeleted": False,
                "isProcessed": True
            }
        },
        {
            "$addFields": {
                "severityOrder": {
                    "$switch": {
                        "branches": [
                            {"case": {"$eq": ["$severity", "hot"]}, "then": 1},
                            {"case": {"$eq": ["$severity", "normal"]}, "then": 2}
                        ],
                        "default": 3
                    }
                },
                "dateTimeObj": {
                    "$dateFromString": {
                        "dateString": {"$concat": ["$date", "T", "$time"]},
                        "format": "%Y-%m-%dT%H:%M"
                    }
                }
            }
        },
        {"$sort": {"severityOrder": 1, "dateTimeObj": -1}},
        {
            "$project": {
                "severityOrder": 0,
                "dateTimeObj": 0
            }
        }
    ]
    news_items = await user_collection.aggregate(pipeline).to_list(length=None)
    return {
        "status": "success",
        "data": news_items,
    }

@news_router.get("/news_by_title")
async def get_news_by_title(
    keyword: str = Query(..., description="Từ khóa tiêu đề")
):
    '''
    Search news items by title keyword.
    '''
    pipeline = [
        {
            "$match": {
                "title": {"$regex": keyword, "$options": "i"},
                "isDeleted": False,
                "isProcessed": True
            }
        },
        {
            "$addFields": {
                "severityOrder": {
                    "$switch": {
                        "branches": [
                            {"case": {"$eq": ["$severity", "hot"]}, "then": 1},
                            {"case": {"$eq": ["$severity", "normal"]}, "then": 2}
                        ],
                        "default": 3
                    }
                },
                "dateTimeObj": {
                    "$dateFromString": {
                        "dateString": {"$concat": ["$date", "T", "$time"]},
                        "format": "%Y-%m-%dT%H:%M"
                    }
                }
            }
        },
        {"$sort": {"severityOrder": 1, "dateTimeObj": -1}},
        {
            "$project": {
                "severityOrder": 0,
                "dateTimeObj": 0
            }
        }
    ]
    news_items = await user_collection.aggregate(pipeline).to_list(length=None)
    return {
        "status": "success",
        "data": news_items,
    }

@news_router.post("/add_news")
async def add_news(item: dict = Body(...)):
    '''
    Insert a new news item into the database.
    '''
    item["isDeleted"] = False
    item["isProcessed"] = False
    result = await user_collection.insert_one(item)
    return {
        "status": "success",
        "inserted_id": str(result.inserted_id)
    }

@news_router.put("/edit_news/{news_id}")
async def edit_news(news_id: str, update_data: dict = Body(...)):
    '''
    Update an existing news item in the database.
    '''
    result = await user_collection.update_one(
        {"_id": ObjectId(news_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        return {"status": "error", "message": "News item not found"}
    return {"status": "success", "modified_count": result.modified_count}

@news_router.put("/delete_news/{news_id}")
async def delete_news(news_id: str):
    '''
    Delete a news item from the database by marking it as deleted.
    '''
    result = await user_collection.update_one(
        {"_id": ObjectId(news_id)},
        {"$set": {"isDeleted": True}}
    )
    if result.matched_count == 0:
        return {"status": "error", "message": "News item not found"}
    return {"status": "success", "modified_count": result.modified_count}