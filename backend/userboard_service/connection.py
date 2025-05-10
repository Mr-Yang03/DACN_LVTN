from pymongo import MongoClient
import os

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Đặt URI kết nối MongoDB của bạn tại đây (có thể lấy từ MongoDB Atlas)
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://sinhthanhf012:sinhthanhf012@accounts-traffin.vxinrou.mongodb.net/")

client = MongoClient(MONGO_URI)
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