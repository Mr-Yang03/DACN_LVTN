from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uuid, os, shutil
from langchain_chroma import Chroma
from app.agent import add_pdf_to_vectorstore, query_llm, embedding, VECTOR_STORE_DIR, COLLECTION_NAME
from app.helper import VECTOR_STORE_DIR as TRAFFIC_VECTOR_STORE_DIR, COLLECTION_NAME as TRAFFIC_COLLECTION_NAME


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc chỉ cho phép frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def read_root():
    return HTMLResponse(content=open("app/frontend/index.html").read())

@app.post("/chat/")
async def chat_with_agent(prompt: str = Form(...)):
    answer = query_llm(prompt)
    return {"answer": answer}