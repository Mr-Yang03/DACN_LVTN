from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

from agent import query_llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc chỉ cho phép frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chatbot/")
async def chat_with_agent(prompt: str = Form(...)):
    answer = query_llm(prompt)
    return {"answer": answer}
