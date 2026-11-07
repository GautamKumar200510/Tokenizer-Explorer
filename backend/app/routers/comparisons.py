from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, Field
from typing import Optional
from app.services.comparison_engine import (
    generate_multi_language_comparison,
    export_comparison_csv
)
from app.database import log_comparison, get_recent_history

router = APIRouter(prefix="/api/comparisons", tags=["Interactive Comparison Charts (U4)"])

class ChartDataRequest(BaseModel):
    custom_texts: Optional[dict[str, str]] = Field(
        default=None,
        description="Optional dictionary with 'english', 'hindi', and 'marathi' texts"
    )
    price_per_million: float = Field(default=2.50, ge=0.01, le=100.0, description="Model input pricing per 1M tokens in USD")
    requests_volume: int = Field(default=10000, ge=1, le=10000000, description="Projected request volume for cost estimation")

@router.post("/chart-data")
async def get_chart_data(req: ChartDataRequest):
    """
    U4 Task: Interactive Comparison Charts.
    Computes real token counts, comparative cost metrics, and tabular rows
    for English, Hindi, and Marathi across BPE, WordPiece, and SentencePiece.
    """
    try:
        data = generate_multi_language_comparison(
            custom_texts=req.custom_texts,
            price_per_million_tokens=req.price_per_million,
            requests_volume=req.requests_volume
        )
        
        # Log comparison to SQLite
        log_comparison(
            pricing_per_million=req.price_per_million,
            results_data={
                "volume": req.requests_volume,
                "token_chart_count": len(data.get("token_comparison_chart", []))
            }
        )
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate chart data: {str(e)}")

@router.post("/export-csv")
async def export_csv(req: ChartDataRequest):
    """Generates and downloads a CSV report of the multi-tokenizer comparison table."""
    try:
        data = generate_multi_language_comparison(
            custom_texts=req.custom_texts,
            price_per_million_tokens=req.price_per_million,
            requests_volume=req.requests_volume
        )
        csv_string = export_comparison_csv(data)
        
        return Response(
            content=csv_string,
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=tokenizer_comparison_report.csv"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export CSV: {str(e)}")

@router.get("/history")
async def get_analysis_history(limit: int = 15):
    """Returns recent analysis events recorded in the SQLite database."""
    history = get_recent_history(limit=limit)
    return {
        "history": history
    }
