import pytest
from app.services.fairness_engine import analyze_language_fairness

def test_u5_language_fairness_analysis():
    metrics = analyze_language_fairness(price_per_million=2.50, context_window_size=128000)
    
    assert "models_breakdown" in metrics
    assert "key_takeaways" in metrics
    assert "linguistic_reasons" in metrics
    assert "engineering_recommendations" in metrics
    
    breakdown = metrics["models_breakdown"]
    assert len(breakdown) == 5
    
    # Check that Hindi/Marathi token ratios are computed
    for model in breakdown:
        assert model["english"]["tokenToWordRatio"] > 0
        assert model["hindi"]["tokenToWordRatio"] > 0
        assert model["marathi"]["tokenToWordRatio"] > 0
        assert model["hindi"]["tokenTaxMultiplier"] > 0
        assert model["hindi"]["wordsInContextWindow"] > 0
