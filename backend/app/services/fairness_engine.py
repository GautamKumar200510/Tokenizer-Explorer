from typing import Any
from app.services.tokenizer_engine import compare_all

DEFAULT_PARALLEL_TEXTS = {
    "english": "Artificial intelligence can help students learn new concepts, practise problem-solving and access information more easily.",
    "hindi": "कृत्रिम बुद्धिमत्ता विद्यार्थियों को नई अवधारणाएँ सीखने, समस्या-समाधान का अभ्यास करने और जानकारी आसानी से प्राप्त करने में मदद कर सकती है।",
    "marathi": "कृत्रिम बुद्धिमत्ता विद्यार्थ्यांना नवीन संकल्पना शिकण्यास, समस्या सोडवण्याचा सराव करण्यास आणि माहिती सहज मिळवण्यास मदत करू शकते।"
}

def analyze_language_fairness(
    custom_texts: dict[str, str] | None = None,
    price_per_million: float = 2.50,
    context_window_size: int = 128000
) -> dict[str, Any]:
    """
    Computes mathematical metrics for the 'Language Tax' on Indian Languages.
    Analyzes token inflation, context window degradation, latency impact, and cost disparity.
    """
    texts = {
        "english": (custom_texts.get("english") if custom_texts and custom_texts.get("english") else DEFAULT_PARALLEL_TEXTS["english"]).strip(),
        "hindi": (custom_texts.get("hindi") if custom_texts and custom_texts.get("hindi") else DEFAULT_PARALLEL_TEXTS["hindi"]).strip(),
        "marathi": (custom_texts.get("marathi") if custom_texts and custom_texts.get("marathi") else DEFAULT_PARALLEL_TEXTS["marathi"]).strip(),
    }

    # Run real tokenization
    en_results = compare_all(texts["english"])
    hi_results = compare_all(texts["hindi"])
    mr_results = compare_all(texts["marathi"])

    tokenizers_to_evaluate = [
        ("gpt2", "GPT-2 (BPE)"),
        ("bert_multilingual", "mBERT (WordPiece)"),
        ("xlm_roberta", "XLM-RoBERTa (SentencePiece)"),
        ("tiktoken_cl100k", "GPT-4 (cl100k)"),
        ("tiktoken_o200k", "GPT-4o (o200k)"),
    ]

    breakdown_by_model = []

    for tok_key, tok_label in tokenizers_to_evaluate:
        en_t = en_results["tokenizers"][tok_key]["token_count"]
        hi_t = hi_results["tokenizers"][tok_key]["token_count"]
        mr_t = mr_results["tokenizers"][tok_key]["token_count"]

        en_w = en_results["tokenizers"][tok_key]["word_count"]
        hi_w = hi_results["tokenizers"][tok_key]["word_count"]
        mr_w = mr_results["tokenizers"][tok_key]["word_count"]

        en_ratio = round(en_t / max(en_w, 1), 2)
        hi_ratio = round(hi_t / max(hi_w, 1), 2)
        mr_ratio = round(mr_t / max(mr_w, 1), 2)

        hi_tax_multiplier = round(hi_t / max(en_t, 1), 2)
        mr_tax_multiplier = round(mr_t / max(en_t, 1), 2)

        # Context window equivalent capacity in words:
        # words_fitted = context_window_size / ratio
        en_words_capacity = int(context_window_size / max(en_ratio, 0.1))
        hi_words_capacity = int(context_window_size / max(hi_ratio, 0.1))
        mr_words_capacity = int(context_window_size / max(mr_ratio, 0.1))

        # Effective context penalty
        hi_context_shrinkage_pct = round((1.0 - (hi_words_capacity / max(en_words_capacity, 1))) * 100, 1)
        mr_context_shrinkage_pct = round((1.0 - (mr_words_capacity / max(en_words_capacity, 1))) * 100, 1)

        breakdown_by_model.append({
            "modelKey": tok_key,
            "modelName": tok_label,
            "english": {
                "tokens": en_t,
                "words": en_w,
                "tokenToWordRatio": en_ratio,
                "costPerMillionCalls": round((en_t * 1_000_000 / 1_000_000.0) * price_per_million, 2),
                "wordsInContextWindow": en_words_capacity,
            },
            "hindi": {
                "tokens": hi_t,
                "words": hi_w,
                "tokenToWordRatio": hi_ratio,
                "tokenTaxMultiplier": hi_tax_multiplier,
                "costPerMillionCalls": round((hi_t * 1_000_000 / 1_000_000.0) * price_per_million, 2),
                "wordsInContextWindow": hi_words_capacity,
                "contextShrinkagePct": max(hi_context_shrinkage_pct, 0.0),
            },
            "marathi": {
                "tokens": mr_t,
                "words": mr_w,
                "tokenToWordRatio": mr_ratio,
                "tokenTaxMultiplier": mr_tax_multiplier,
                "costPerMillionCalls": round((mr_t * 1_000_000 / 1_000_000.0) * price_per_million, 2),
                "wordsInContextWindow": mr_words_capacity,
                "contextShrinkagePct": max(mr_context_shrinkage_pct, 0.0),
            }
        })

    # Summary metrics focusing on standard LLM (GPT-4 cl100k) and latest (GPT-4o o200k)
    gpt4_data = next(item for item in breakdown_by_model if item["modelKey"] == "tiktoken_cl100k")
    gpt4o_data = next(item for item in breakdown_by_model if item["modelKey"] == "tiktoken_o200k")

    return {
        "context_window_size": context_window_size,
        "price_per_million": price_per_million,
        "sample_texts": texts,
        "models_breakdown": breakdown_by_model,
        "key_takeaways": {
            "token_tax_hindi_gpt4": f"{gpt4_data['hindi']['tokenTaxMultiplier']}x",
            "token_tax_marathi_gpt4": f"{gpt4_data['marathi']['tokenTaxMultiplier']}x",
            "gpt4o_improvement_hindi": f"Reduced token count from {gpt4_data['hindi']['tokens']} to {gpt4o_data['hindi']['tokens']} tokens",
            "context_window_penalty_hindi": f"{gpt4_data['hindi']['contextShrinkagePct']}% loss in effective document capacity",
            "context_window_penalty_marathi": f"{gpt4_data['marathi']['contextShrinkagePct']}% loss in effective document capacity",
        },
        "linguistic_reasons": [
            {
                "factor": "Devanagari UTF-8 3-Byte Encoding",
                "explanation": "Every Devanagari character occupies 3 bytes in UTF-8 (e.g. 'क' = E0 A4 95). If the subword tokenizer does not have the combined character in its vocabulary, it falls back to byte-level BPE, producing up to 3 individual tokens for a single glyph."
            },
            {
                "factor": "Abugida Syllabic Structure & Matras",
                "explanation": "Indian scripts are abugidas where dependent vowels (matras), virama/halant (्), and conjuncts combine to form single syllabic aksharas (e.g. 'कृ'). Tokenizers trained with Latin-centric heuristics often cleave matras from base consonants."
            },
            {
                "factor": "Pretraining Corpus Imbalance",
                "explanation": "Common Crawl and the web corpora used to train BPE merges are overwhelmingly English (>85%). Hindi comprises less than 0.15% and Marathi less than 0.03%, meaning BPE merge operations prioritize frequent English letter pairs (like 'ing', 'tion', 'the') over Indic words."
            },
            {
                "factor": "Compound Morphology & Agglutination",
                "explanation": "Marathi and Hindi use postpositions, inflections, and case markers that are often attached or compounded ('शिकण्यास', 'सोडवण्याचा'), causing subword segmenters to fragment words into multiple tiny sub-units."
            }
        ],
        "engineering_recommendations": [
            "Use modern tokenizers with expanded multilingual vocabularies (e.g., GPT-4o o200k, XLM-RoBERTa, Llama 3 128k) over legacy tokenizers.",
            "Deploy dedicated Indic-first foundation models (e.g., Navarasa, Sarvam AI, AI4Bharat IndicBERT) for production workloads in regional languages.",
            "Account for context window compression in Retrieval-Augmented Generation (RAG) chunking: use 3x smaller character chunk sizes for Hindi/Marathi to prevent exceeding token limits.",
            "Encourage cloud API providers to normalize pricing by semantic units (e.g. per word or per character) rather than raw token count to eliminate the regional language financial penalty."
        ]
    }
