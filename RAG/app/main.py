from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from app.agent import query_llm


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