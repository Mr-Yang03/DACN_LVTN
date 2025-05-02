from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Connect MongoDB
MONGO_URI = os.getenv("MONGO_URI", "")
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client["News"]

def get_database():
    return db

# test connection
def test_connection():
    try:
        client.server_info()
        print("Connected to MongoDB ")
    except Exception as e:
        print("Connection error: ", e)
        raise e

test_connection()