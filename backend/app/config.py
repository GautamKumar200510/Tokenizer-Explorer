import os
from pathlib import Path
from dotenv import load_dotenv

# Locate and load .env from the project root or current directory
BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
env_path = ROOT_DIR / ".env"
if not env_path.exists():
    env_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "P20 – Tokenizer Explorer for Indian Languages"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "").strip()
    
    # Database
    DATABASE_PATH: str = str(BASE_DIR / "tokenizer_explorer.db")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]
    # Allow local vite preview / alternative dev ports
    CORS_ORIGINS.extend([
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ])

    @property
    def has_gemini_key(self) -> bool:
        return bool(self.GEMINI_API_KEY and len(self.GEMINI_API_KEY) > 8)

    @property
    def has_openai_key(self) -> bool:
        return bool(self.OPENAI_API_KEY and len(self.OPENAI_API_KEY) > 8)

settings = Settings()
