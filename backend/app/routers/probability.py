from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.probability_engine import get_probability_engine
from app.corpora import CORPUS_REGISTRY
from app.database import log_analysis

router = APIRouter(prefix="/api/probability", tags=["Token Probability Explorer (U1)"])

class ProbabilityRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Input text in English, Hindi, or Marathi")
    language: str = Field(default="english", description="Language of text: english, hindi, or marathi")

@router.post("/analyze")
async def analyze_token_probabilities(req: ProbabilityRequest):
    """
    U1 Task: Token Probability Explorer.
    Splits text into tokens, calculates token frequencies, Laplace-smoothed probabilities,
    surprisals, formula strings, and perplexity using an authentic language corpus.
    """
    lang = req.language.lower()
    if lang not in ["english", "hindi", "marathi"]:
        lang = "english"
        
    engine = get_probability_engine(lang)
    result = engine.analyze_sentence(req.text)
    
    # Log to SQLite
    tokens_count = result.get("total_tokens", 0)
    words = req.text.split()
    word_count = len(words) if words else 1
    log_analysis(
        language=lang,
        tokenizer_name="Unigram-Laplace-Model",
        input_text=req.text,
        token_count=tokens_count,
        word_count=word_count,
        char_count=len(req.text),
        token_to_word_ratio=round(tokens_count / word_count, 2)
    )
    
    return result

@router.get("/corpus-info")
async def get_corpus_info(language: str = "english"):
    """Returns metadata and sample sentences from the authentic corpus for U1."""
    lang = language.lower()
    if lang not in ["english", "hindi", "marathi"]:
        lang = "english"
        
    engine = get_probability_engine(lang)
    sample_sentences = CORPUS_REGISTRY.get(lang, [])[:5]
    
    return {
        "language": lang,
        "total_corpus_tokens_N": engine.total_tokens_N,
        "vocabulary_size_V": engine.vocab_size_V,
        "sample_sentences": sample_sentences,
        "smoothing_type": "Laplace Add-1 Smoothing",
        "formula": "P(w) = (Count(w) + 1) / (N + V)"
    }
