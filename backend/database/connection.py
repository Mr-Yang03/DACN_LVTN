from pymongo import MongoClient
import os

# Connect MongoDB using environment variable for security
MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client["traffic-monitor"]
# user_collection = db["user"]

def get_database():
    return db