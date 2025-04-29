from pymongo import MongoClient
import os

# Connect MongoDB using environment variable for security
MONGO_URI = os.getenv("mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client["traffic"]

def get_database():
    return db

# test connection
def test_connection():
    try:
        client.server_info()
        print("Connected to MongoDB")
    except Exception as e:
        print("Connection error: ", e)
        raise e

test_connection()