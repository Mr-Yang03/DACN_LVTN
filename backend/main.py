from fastapi import FastAPI
from dotenv import load_dotenv
from login import login_router

# Load environment variables from a .env file
load_dotenv()

# FastAPI
app = FastAPI()

app.include_router(login_router)