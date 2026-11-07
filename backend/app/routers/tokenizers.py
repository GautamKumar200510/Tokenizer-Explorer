from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.tokenizer_engine import (
    compare_all,
    tokenize_single,
    TOKENIZER_METADATA
)
from app.database import log_analysis

router = APIRouter(prefix="/api/tokenizers", tags=["Tokenizer Comparisons (U2)"])

class TokenizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Input text to tokenize")
    add_special_tokens: bool = Field(default=False, description="Whether to include special tokens like [CLS] or <s>")

class SingleTokenizerRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    tokenizer_id: str = Field(..., description="gpt2, bert_multilingual, xlm_roberta, tiktoken_cl100k, tiktoken_o200k")
    add_special_tokens: bool = Field(default=False)

@router.post("/compare")
async def compare_tokenizers(req: TokenizeRequest):
    """
    U2 Task: BPE, WordPiece and SentencePiece comparison.
    Runs actual tokenizers side-by-side on the provided text, returning real token IDs,
    boundary markers, and token counts.
    """
    try:
        results = compare_all(req.text, req.add_special_tokens)
        
        # Log each model's result to SQLite
        words = req.text.split()
        word_count = len(words) if words else 1
        for tok_id, tok_res in results["tokenizers"].items():
            log_analysis(
                language="multilingual",
                tokenizer_name=tok_res["name"],
                input_text=req.text,
                token_count=tok_res["token_count"],
                word_count=word_count,
                char_count=len(req.text),
                token_to_word_ratio=tok_res["token_to_word_ratio"]
            )
            
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tokenization error: {str(e)}")

@router.post("/single")
async def run_single_tokenizer(req: SingleTokenizerRequest):
    """Runs a single tokenizer and returns detailed tokenization breakdowns."""
    try:
        result = tokenize_single(req.text, req.tokenizer_id, req.add_special_tokens)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tokenization error: {str(e)}")

@router.get("/metadata")
async def get_tokenizers_metadata():
    """Returns technical details, algorithms, and vocab sizes for all 5 supported tokenizers."""
    return {
        "supported_tokenizers": TOKENIZER_METADATA
    }
