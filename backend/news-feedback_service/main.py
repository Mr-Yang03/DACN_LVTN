from fastapi import FastAPI, UploadFile, File
from google.cloud import storage
import os

app = FastAPI()

# Thiết lập credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key/ggmap-456203-58579108ac37.json"

# Khởi tạo client
storage_client = storage.Client()
bucket_name = "bucket_ggmap-456203"
bucket = storage_client.bucket(bucket_name)

@app.post("/news/upload")
async def upload_file(file: UploadFile = File(...)):
    folder_path = "traffic-news"
    file_path = f"{folder_path}/{file.filename}"

    blob = bucket.blob(file_path)
    blob.upload_from_file(file.file, content_type=file.content_type)

    return {
        "message": f"Uploaded {file.filename} to GCS",
        "file_path": file_path,
        "public_url": blob.public_url
    }


@app.post("/feedback/upload")
async def upload_file(file: UploadFile = File(...)):
    folder_path = "traffic-feedbacks"
    file_path = f"{folder_path}/{file.filename}"

    blob = bucket.blob(file_path)
    blob.upload_from_file(file.file, content_type=file.content_type)

    return {
        "message": f"Uploaded {file.filename} to GCS",
        "file_path": file_path,
        "public_url": blob.public_url
    }
