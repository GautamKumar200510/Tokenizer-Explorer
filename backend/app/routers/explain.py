from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.tokenizer_engine import compare_all
from app.services.gemini_service import explain_tokenizer_differences_with_gemini

router = APIRouter(prefix="/api/explain", tags=["AI Explanations (U2 & U5)"])

class ExplainRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Input text to explain")

@router.post("/tokenizer-differences")
async def explain_tokenizer_differences(req: ExplainRequest):
    """
    U2 Task: AI explanation of tokenizer differences.
    Takes the actual tokenization results and generates an easy-to-understand
    explanation of BPE, WordPiece, and SentencePiece behavior on Indian scripts.
    """
    try:
        comparison_res = compare_all(req.text)
        explanation = await explain_tokenizer_differences_with_gemini(
            text=req.text,
            tokenizer_comparisons=comparison_res["tokenizers"]
        )
        return {
            "input_text": req.text,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation generation failed: {str(e)}")
