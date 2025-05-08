from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Connect MongoDB using environment variable for security
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI","")
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client["accounts-traffic"]

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