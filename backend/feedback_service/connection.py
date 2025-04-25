from pymongo import MongoClient
import os

# Connect MongoDB using environment variable for security
MONGO_URI = os.getenv("mongodb+srv://duongphucthang2003:violentpandas@mycluster.1u5sh2d.mongodb.net/")
client = MongoClient(MONGO_URI)

# Choose database and collection
db = client["Feedback"]

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