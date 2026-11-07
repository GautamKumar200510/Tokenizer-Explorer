import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.services.whisper_service import (
    transcribe_audio_file,
    get_available_audio_samples,
    SAMPLE_AUDIO_DIR
)
from app.services.tokenizer_engine import tokenize_single
from app.database import log_audio_transcription

router = APIRouter(prefix="/api/speech", tags=["Hindi Speech & Whisper Transcription (U3)"])

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    U3 Task: Hindi Speech-to-Text Transcription via Whisper API.
    Accepts uploaded audio (.wav, .mp3, .m4a, .ogg, .webm).
    Returns verified Hindi transcript with token count projections.
    """
    try:
        content = await file.read()
        filename = file.filename or "recording.wav"
        mime_type = file.content_type
        
        result = transcribe_audio_file(
            file_bytes=content,
            filename=filename,
            mime_type=mime_type
        )
        
        transcript = result.get("transcript", "")
        gpt_tokens = 0
        bert_tokens = 0
        
        if transcript:
            try:
                gpt_res = tokenize_single(transcript, "tiktoken_cl100k")
                bert_res = tokenize_single(transcript, "bert_multilingual")
                gpt_tokens = gpt_res["token_count"]
                bert_tokens = bert_res["token_count"]
                result["quick_tokens"] = {
                    "gpt_tokens": gpt_tokens,
                    "bert_tokens": bert_tokens,
                    "word_count": len(transcript.split())
                }
            except Exception:
                pass

        # Log transcription to SQLite
        log_audio_transcription(
            filename=filename,
            transcript=transcript,
            token_count_gpt=gpt_tokens,
            token_count_bert=bert_tokens
        )
        
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech transcription failed: {str(e)}")

@router.get("/samples")
async def list_sample_audio_clips():
    """Returns curated authentic Hindi speech samples for quick demonstration."""
    samples = get_available_audio_samples()
    for s in samples:
        s["audio_url"] = f"/api/speech/sample-audio/{s['filename']}"
    return {
        "samples": samples
    }

@router.get("/sample-audio/{filename}")
async def serve_sample_audio(filename: str):
    """Serves the PCM WAV sample file for playback in the browser."""
    safe_name = os.path.basename(filename)
    file_path = SAMPLE_AUDIO_DIR / safe_name
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Sample audio file not found")
        
    return FileResponse(
        path=str(file_path),
        media_type="audio/wav",
        filename=safe_name
    )
