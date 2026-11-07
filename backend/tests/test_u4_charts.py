import pytest
from app.services.comparison_engine import generate_multi_language_comparison, export_comparison_csv

def test_u4_chart_generation_and_costs():
    data = generate_multi_language_comparison(
        price_per_million_tokens=3.0,
        requests_volume=50000
    )
    
    assert "token_comparison_chart" in data
    assert "cost_comparison_chart" in data
    assert "table_rows" in data
    
    chart = data["token_comparison_chart"]
    assert len(chart) == 5 # 5 tokenizers
    for item in chart:
        assert "English" in item
        assert "Hindi" in item
        assert "Marathi" in item
        assert item["English"] > 0
        assert item["Hindi"] > 0

    # Test CSV export
    csv_text = export_comparison_csv(data)
    assert "Language" in csv_text
    assert "Tokenizer Name" in csv_text
    assert "Hindi" in csv_text
    assert "Marathi" in csv_text
