import sqlite3
import json
from datetime import datetime
from typing import Any, Optional
from app.config import settings

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    """Initialize database tables for logging tokenization and speech events."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Analysis history table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS token_analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            language TEXT NOT NULL,
            tokenizer_name TEXT NOT NULL,
            input_text TEXT NOT NULL,
            token_count INTEGER NOT NULL,
            word_count INTEGER NOT NULL,
            char_count INTEGER NOT NULL,
            token_to_word_ratio REAL NOT NULL
        )
    """)

    # 2. Comparison runs table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comparison_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            pricing_per_million REAL NOT NULL,
            results_json TEXT NOT NULL
        )
    """)

    # 3. Audio transcriptions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audio_transcriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            filename TEXT NOT NULL,
            duration_estimate TEXT,
            transcript TEXT NOT NULL,
            token_count_gpt INTEGER,
            token_count_bert INTEGER
        )
    """)

    conn.commit()
    conn.close()

def log_analysis(
    language: str,
    tokenizer_name: str,
    input_text: str,
    token_count: int,
    word_count: int,
    char_count: int,
    token_to_word_ratio: float,
) -> None:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO token_analyses (
                timestamp, language, tokenizer_name, input_text,
                token_count, word_count, char_count, token_to_word_ratio
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.utcnow().isoformat(),
            language,
            tokenizer_name,
            input_text[:500], # truncated for safety
            token_count,
            word_count,
            char_count,
            token_to_word_ratio
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging analysis to database: {e}")

def log_comparison(pricing_per_million: float, results_data: dict[str, Any]) -> None:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO comparison_runs (timestamp, pricing_per_million, results_json)
            VALUES (?, ?, ?)
        """, (
            datetime.utcnow().isoformat(),
            pricing_per_million,
            json.dumps(results_data)
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging comparison: {e}")

def log_audio_transcription(
    filename: str,
    transcript: str,
    token_count_gpt: Optional[int] = None,
    token_count_bert: Optional[int] = None,
    duration_estimate: Optional[str] = None
) -> None:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO audio_transcriptions (
                timestamp, filename, duration_estimate, transcript,
                token_count_gpt, token_count_bert
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            datetime.utcnow().isoformat(),
            filename,
            duration_estimate or "N/A",
            transcript,
            token_count_gpt,
            token_count_bert
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging audio transcription: {e}")

def get_recent_history(limit: int = 15) -> list[dict[str, Any]]:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, timestamp, language, tokenizer_name, input_text,
                   token_count, word_count, char_count, token_to_word_ratio
            FROM token_analyses
            ORDER BY id DESC
            LIMIT ?
        """, (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    except Exception as e:
        print(f"Error fetching history: {e}")
        return []
