from fastapi import FastAPI
from dotenv import load_dotenv
from login import login_router
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from a .env file
load_dotenv()

# FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(login_router)