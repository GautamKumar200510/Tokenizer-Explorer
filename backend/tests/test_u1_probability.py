import pytest
from app.services.probability_engine import get_probability_engine

def test_u1_unigram_model_english():
    engine = get_probability_engine("english")
    assert engine.total_tokens_N > 0
    assert engine.vocab_size_V > 0

    text = "Artificial intelligence can help students"
    analysis = engine.analyze_sentence(text)
    
    assert analysis["total_tokens"] == 5
    assert len(analysis["tokens"]) == 5
    assert analysis["perplexity"] > 0
    assert analysis["sequence_log_likelihood"] < 0
    
    # Check Laplace smoothing on first token
    first_token = analysis["tokens"][0]
    assert first_token["token"] == "Artificial"
    assert first_token["probability"] > 0
    assert first_token["numerator"] == first_token["raw_count"] + 1
    assert first_token["denominator"] == engine.total_tokens_N + engine.vocab_size_V

def test_u1_unigram_model_hindi():
    engine = get_probability_engine("hindi")
    assert engine.total_tokens_N > 0
    assert engine.vocab_size_V > 0

    text = "कृत्रिम बुद्धिमत्ता विद्यार्थियों को मदद करती है।"
    analysis = engine.analyze_sentence(text)
    
    assert analysis["total_tokens"] > 0
    assert "perplexity" in analysis
    assert "smoothing_formula" in analysis
    assert "toy_vs_llm_comparison" in analysis

def test_u1_unigram_model_marathi():
    engine = get_probability_engine("marathi")
    assert engine.total_tokens_N > 0
    assert engine.vocab_size_V > 0

    text = "कृत्रिम बुद्धिमत्ता विद्यार्थ्यांना मदत करू शकते।"
    analysis = engine.analyze_sentence(text)
    assert analysis["total_tokens"] > 0
    assert analysis["tokens"][0]["is_oov"] in [True, False]
