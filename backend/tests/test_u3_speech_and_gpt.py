from app.services.tokenizer_engine import tokenize_single
from app.services.whisper_service import transcribe_audio_file, get_available_audio_samples

def test_u3_bert_vs_gpt_tiktoken():
    text = "Artificial intelligence can help students"
    bert_res = tokenize_single(text, "bert_multilingual")
    gpt_cl100k = tokenize_single(text, "tiktoken_cl100k")
    gpt_o200k = tokenize_single(text, "tiktoken_o200k")
    
    assert bert_res["token_count"] > 0
    assert gpt_cl100k["token_count"] > 0
    assert gpt_o200k["token_count"] > 0
    assert len(gpt_cl100k["tokens"]) == gpt_cl100k["token_count"]

def test_u3_speech_sample_retrieval_and_transcription():
    samples = get_available_audio_samples()
    assert len(samples) >= 3
    sample_1 = samples[0]
    assert "कृत्रिम बुद्धिमत्ता" in sample_1["full_transcript"]

    # Synchronous transcription test
    res = transcribe_audio_file(
        file_bytes=b"RIFF dummy wav data",
        filename=sample_1["filename"]
    )
    assert res["status"] == "success"
    assert "कृत्रिम बुद्धिमत्ता" in res["transcript"]
