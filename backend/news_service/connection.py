from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# Connect MongoDB using environment variable for security
MONGO_URI = os.getenv("MONGODB_URI_PT")
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client["News"]

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