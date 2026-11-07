import pytest
from app.services.tokenizer_engine import compare_all, tokenize_single

def test_u2_tokenizer_comparison_hindi():
    text = "कृत्रिम बुद्धिमत्ता"
    res = compare_all(text)
    
    assert "tokenizers" in res
    toks = res["tokenizers"]
    
    assert "gpt2" in toks
    assert "bert_multilingual" in toks
    assert "xlm_roberta" in toks
    assert "tiktoken_cl100k" in toks
    assert "tiktoken_o200k" in toks
    
    # Real token count verification
    assert toks["gpt2"]["token_count"] > 0
    assert toks["bert_multilingual"]["token_count"] > 0
    assert toks["xlm_roberta"]["token_count"] > 0
    
    # Boundary markers
    assert "Ġ" in toks["gpt2"]["boundary_marker"]
    assert "##" in toks["bert_multilingual"]["boundary_marker"]
    assert " " in toks["xlm_roberta"]["boundary_marker"]

def test_u2_single_tokenizer_wordpiece():
    text = "Students learn new concepts"
    res = tokenize_single(text, "bert_multilingual")
    assert res["name"] == "mBERT (WordPiece)"
    assert res["token_count"] >= 4
    assert len(res["tokens"]) == res["token_count"]
