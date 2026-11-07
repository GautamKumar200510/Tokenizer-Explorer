from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.services.fairness_engine import analyze_language_fairness
from app.services.gemini_service import generate_fairness_report_with_gemini

router = APIRouter(prefix="/api/fairness", tags=["Cost Fairness for Indian Languages (U5)"])

class FairnessRequest(BaseModel):
    custom_texts: Optional[dict[str, str]] = None
    price_per_million: float = Field(default=2.50, ge=0.01, le=100.0)
    context_window_size: int = Field(default=128000, ge=1024, le=2000000)

@router.post("/analyze")
async def get_language_fairness_analysis(req: FairnessRequest):
    """
    U5 Task: Cost Fairness for Indian Languages.
    Calculates token-to-word ratios, effective context window capacity,
    cost disparity multipliers, and root technical causes of unequal tokenization.
    """
    try:
        metrics = analyze_language_fairness(
            custom_texts=req.custom_texts,
            price_per_million=req.price_per_million,
            context_window_size=req.context_window_size
        )
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fairness analysis failed: {str(e)}")

@router.post("/gemini-analysis")
async def get_gemini_fairness_report(req: FairnessRequest):
    """
    U5 Task: Gemini-powered fairness synthesis report based on actual measured metrics.
    """
    try:
        metrics = analyze_language_fairness(
            custom_texts=req.custom_texts,
            price_per_million=req.price_per_million,
            context_window_size=req.context_window_size
        )
        ai_report = await generate_fairness_report_with_gemini(metrics)
        return {
            "metrics": metrics,
            "ai_report": ai_report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini fairness report failed: {str(e)}")
