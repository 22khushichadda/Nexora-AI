from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Database
from app.database.database import engine
from app.database.models import Base

# Routers
from app.api.workspace import router as workspace_router
from app.api.document import router as document_router
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nexora AI",
    description="AI-Powered Research Copilot",
    version="1.0.0"
)

# ---------------------------------
# CORS
# ---------------------------------

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
if frontend_url and frontend_url not in origins:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------
# Serve uploaded PDFs
# ---------------------------------

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_FOLDER),
    name="uploads"
)

# ---------------------------------
# Routers
# ---------------------------------

app.include_router(auth_router)
app.include_router(workspace_router)
app.include_router(document_router)
app.include_router(chat_router)

# ---------------------------------
# Home
# ---------------------------------

@app.get("/")
def home():

    return {

        "project": "Nexora AI",

        "message": "Welcome to Nexora AI 🚀",

        "status": "Backend Running Successfully"

    }

# ---------------------------------
# About
# ---------------------------------

@app.get("/about")
def about():

    return {

        "name": "Nexora AI",

        "developer": "Khushi Chadda",

        "purpose": "AI Research Copilot",

        "version": "1.0.0"

    }