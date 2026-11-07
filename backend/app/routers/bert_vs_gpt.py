from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.tokenizer_engine import (
    tokenize_single,
    TOKENIZER_METADATA
)

router = APIRouter(prefix="/api/bert-vs-gpt", tags=["BERT vs GPT Tokenizer Comparison (U3)"])

class BertVsGptRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Input text to compare BERT vs GPT")
    gpt_encoding: str = Field(default="cl100k", description="cl100k (GPT-4), o200k (GPT-4o), or gpt2 (GPT-2)")

@router.post("/compare")
async def compare_bert_and_gpt(req: BertVsGptRequest):
    """
    U3 Task: Real BERT vs Real GPT Tokenizer Comparison.
    Uses real HuggingFace bert-base-multilingual-cased and OpenAI tiktoken.
    Displays token IDs, raw pieces, decoded text, boundaries, and comparative metrics.
    """
    try:
        # 1. Real BERT tokenizer
        bert_result = tokenize_single(req.text, "bert_multilingual", add_special_tokens=False)

        # 2. Selected GPT tokenizer
        gpt_key = "tiktoken_cl100k"
        if req.gpt_encoding == "o200k":
            gpt_key = "tiktoken_o200k"
        elif req.gpt_encoding == "gpt2":
            gpt_key = "gpt2"

        gpt_result = tokenize_single(req.text, gpt_key, add_special_tokens=False)

        # Comparative metrics
        bert_tokens = bert_result["token_count"]
        gpt_tokens = gpt_result["token_count"]
        token_diff = gpt_tokens - bert_tokens
        
        comparison_summary = {
            "bert_token_count": bert_tokens,
            "gpt_token_count": gpt_tokens,
            "token_difference": token_diff,
            "more_compact_model": "BERT (WordPiece)" if bert_tokens < gpt_tokens else "GPT (Tiktoken)" if gpt_tokens < bert_tokens else "Tied",
            "gpt_selected_encoding": TOKENIZER_METADATA[gpt_key]["name"],
            "gpt_encoding_id": TOKENIZER_METADATA[gpt_key].get("encoding_name", "gpt2"),
            "bert_model_id": "bert-base-multilingual-cased"
        }

        return {
            "input_text": req.text,
            "summary": comparison_summary,
            "bert": bert_result,
            "gpt": gpt_result,
            "architectural_contrast": {
                "bert": {
                    "model": "bert-base-multilingual-cased",
                    "algorithm": "WordPiece",
                    "vocabulary_size": 119547,
                    "boundary_convention": "## prefix indicates continuation subword",
                    "design_philosophy": "Bidirectional contextual encoder trained with Masked LM objective."
                },
                "gpt": {
                    "model": TOKENIZER_METADATA[gpt_key]["name"],
                    "algorithm": "Byte-level BPE",
                    "vocabulary_size": TOKENIZER_METADATA[gpt_key]["vocab_size"],
                    "boundary_convention": "Spaces encoded directly into leading bytes of subwords",
                    "design_philosophy": "Autoregressive causal decoder trained for next-token prediction."
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")
