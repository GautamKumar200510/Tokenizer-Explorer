from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routers import (
    probability,
    tokenizers,
    bert_vs_gpt,
    speech,
    comparisons,
    fairness,
    explain
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize SQLite tables and sample files
    init_db()
    print("=" * 70)
    print(" [Tokenizer Explorer for Indian Languages] Backend Initialized")
    print(f" Environment: {settings.ENVIRONMENT}")
    print(f" Database: {settings.DATABASE_PATH}")
    print(f" Gemini API: {'Configured' if settings.has_gemini_key else 'Optional (Offline Fallback Active)'}")
    print(f" OpenAI Whisper API: {'Configured' if settings.has_openai_key else 'Optional (Audio Samples & Fallback Active)'}")
    print("=" * 70)
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Interactive educational web application comparing tokenization across English, Hindi, and Marathi.",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(probability.router)
app.include_router(tokenizers.router)
app.include_router(bert_vs_gpt.router)
app.include_router(speech.router)
app.include_router(comparisons.router)
app.include_router(fairness.router)
app.include_router(explain.router)

@app.get("/api/health")
async def health_check():
    """System health and configuration status endpoint."""
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "api_keys": {
            "gemini_configured": settings.has_gemini_key,
            "openai_whisper_configured": settings.has_openai_key,
        },
        "default_samples": {
            "english": "Artificial intelligence can help students learn new concepts, practise problem-solving and access information more easily.",
            "hindi": "कृत्रिम बुद्धिमत्ता विद्यार्थियों को नई अवधारणाएँ सीखने, समस्या-समाधान का अभ्यास करने और जानकारी आसानी से प्राप्त करने में मदद कर सकती है।",
            "marathi": "कृत्रिम बुद्धिमत्ता विद्यार्थ्यांना नवीन संकल्पना शिकण्यास, समस्या सोडवण्याचा सराव करण्यास आणि माहिती सहज मिळवण्यास मदत करू शकते।"
        }
    }
