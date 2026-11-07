import os
from typing import Any, Optional
import tiktoken
from transformers import AutoTokenizer

# Set offline mode for instant loading from local HF cache
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

# Initialize global tokenizer instances lazily or on import
_tokenizers_cache: dict[str, Any] = {}

TOKENIZER_METADATA = {
    "gpt2": {
        "id": "gpt2",
        "name": "GPT-2 (Byte-Level BPE)",
        "algorithm": "Byte-Pair Encoding (BPE)",
        "hf_model": "gpt2",
        "vocab_size": 50257,
        "boundary_marker": "Ġ (Leading space marker)",
        "family": "BPE",
        "description": "Standard byte-level BPE introduced in GPT-2. Uses byte-level encoding to prevent out-of-vocabulary tokens, but causes significant token inflation on Indic scripts.",
        "indic_efficiency": "Poor (Devanagari characters often fragment into 2-3 byte tokens)"
    },
    "bert_multilingual": {
        "id": "bert_multilingual",
        "name": "mBERT (WordPiece)",
        "algorithm": "WordPiece",
        "hf_model": "bert-base-multilingual-cased",
        "vocab_size": 119547,
        "boundary_marker": "## (Continuation prefix)",
        "family": "WordPiece",
        "description": "Multilingual BERT trained on 104 languages. Uses a likelihood-maximizing greedy split with ## marking continuation fragments.",
        "indic_efficiency": "Moderate (Allocates a fraction of 119k vocab to Devanagari words and syllables)"
    },
    "xlm_roberta": {
        "id": "xlm_roberta",
        "name": "XLM-RoBERTa (SentencePiece)",
        "algorithm": "SentencePiece (BPE / Unigram)",
        "hf_model": "xlm-roberta-base",
        "vocab_size": 250002,
        "boundary_marker": "  (U+2581 Lower One Eighth Block)",
        "family": "SentencePiece",
        "description": "SentencePiece tokenizer with a 250k multilingual vocabulary. Treats whitespace as regular characters and operates directly on raw unicode strings.",
        "indic_efficiency": "Good (Large vocabulary accommodates frequent Hindi and Marathi morphemes)"
    },
    "tiktoken_cl100k": {
        "id": "tiktoken_cl100k",
        "name": "GPT-4 / GPT-3.5 (cl100k_base)",
        "algorithm": "Byte-level BPE (cl100k_base)",
        "encoding_name": "cl100k_base",
        "vocab_size": 100277,
        "boundary_marker": "Whitespace attached to token",
        "family": "GPT Encoding",
        "description": "OpenAI's 100k token encoding powering GPT-4 and GPT-3.5-Turbo. Significant improvements over GPT-2, but still carries a measurable token tax on Indic text.",
        "indic_efficiency": "Fair (3.0 - 4.2 tokens per Indic word)"
    },
    "tiktoken_o200k": {
        "id": "tiktoken_o200k",
        "name": "GPT-4o (o200k_base)",
        "algorithm": "Byte-level BPE (o200k_base)",
        "encoding_name": "o200k_base",
        "vocab_size": 200019,
        "boundary_marker": "Whitespace attached to token",
        "family": "GPT Encoding",
        "description": "OpenAI's latest 200k token encoding introduced with GPT-4o. Specifically optimized for non-English and Indian languages, drastically reducing token inflation.",
        "indic_efficiency": "Very Good (~1.5 - 2.2 tokens per Indic word, cutting token costs by ~40-60%)"
    }
}

def get_hf_tokenizer(model_id: str):
    """Loads and caches HuggingFace tokenizers locally."""
    if model_id not in _tokenizers_cache:
        try:
            tok = AutoTokenizer.from_pretrained(model_id, local_files_only=True)
        except Exception:
            # Fallback if local_files_only fails
            tok = AutoTokenizer.from_pretrained(model_id)
        _tokenizers_cache[model_id] = tok
    return _tokenizers_cache[model_id]

def get_tiktoken_encoding(encoding_name: str):
    """Loads and caches tiktoken encodings."""
    cache_key = f"tiktoken_{encoding_name}"
    if cache_key not in _tokenizers_cache:
        enc = tiktoken.get_encoding(encoding_name)
        _tokenizers_cache[cache_key] = enc
    return _tokenizers_cache[cache_key]

def tokenize_hf_model(
    text: str,
    tokenizer_key: str,
    hf_model_name: str,
    add_special_tokens: bool = False
) -> dict[str, Any]:
    """Tokenize text using Hugging Face AutoTokenizer."""
    tok = get_hf_tokenizer(hf_model_name)
    meta = TOKENIZER_METADATA[tokenizer_key]
    
    encoding = tok(
        text,
        add_special_tokens=add_special_tokens,
        return_offsets_mapping=True if tok.is_fast else False
    )
    
    token_ids = encoding["input_ids"]
    raw_tokens = tok.convert_ids_to_tokens(token_ids)
    
    token_items = []
    for idx, (t_id, raw_t) in enumerate(zip(token_ids, raw_tokens)):
        # Decoded individual piece
        decoded_piece = tok.decode([t_id], clean_up_tokenization_spaces=False)
        
        # Determine boundary characteristics
        is_word_start = False
        is_subword_continuation = False
        
        if tokenizer_key == "gpt2":
            if raw_t.startswith("Ġ"):
                is_word_start = True
            elif idx > 0:
                is_subword_continuation = True
        elif tokenizer_key == "bert_multilingual":
            if raw_t.startswith("##"):
                is_subword_continuation = True
            else:
                is_word_start = True
        elif tokenizer_key == "xlm_roberta":
            if raw_t.startswith(" "):
                is_word_start = True
            elif idx > 0:
                is_subword_continuation = True

        token_items.append({
            "index": idx,
            "id": int(t_id),
            "raw_token": raw_t,
            "decoded_piece": decoded_piece,
            "is_word_start": is_word_start,
            "is_subword_continuation": is_subword_continuation,
            "char_length": len(decoded_piece),
            "byte_length": len(decoded_piece.encode("utf-8")),
        })

    words = text.split()
    word_count = len(words) if words else 1
    token_count = len(token_ids)
    char_count = len(text)
    byte_count = len(text.encode("utf-8"))

    return {
        "tokenizer_id": tokenizer_key,
        "name": meta["name"],
        "algorithm": meta["algorithm"],
        "vocab_size": meta["vocab_size"],
        "boundary_marker": meta["boundary_marker"],
        "family": meta["family"],
        "description": meta["description"],
        "indic_efficiency": meta["indic_efficiency"],
        "token_count": token_count,
        "word_count": word_count,
        "char_count": char_count,
        "byte_count": byte_count,
        "token_to_word_ratio": round(token_count / word_count, 2),
        "characters_per_token": round(char_count / max(token_count, 1), 2),
        "bytes_per_token": round(byte_count / max(token_count, 1), 2),
        "tokens": token_items,
    }

def tokenize_tiktoken_encoding(
    text: str,
    tokenizer_key: str,
    encoding_name: str
) -> dict[str, Any]:
    """Tokenize text using tiktoken encoding."""
    enc = get_tiktoken_encoding(encoding_name)
    meta = TOKENIZER_METADATA[tokenizer_key]
    
    token_ids = enc.encode(text)
    token_items = []
    
    for idx, t_id in enumerate(token_ids):
        # Extract raw byte slice
        byte_piece = enc.decode_single_token_bytes(t_id)
        # Try decoding cleanly or replace non-UTF8 bytes
        decoded_piece = byte_piece.decode("utf-8", errors="replace")
        
        is_word_start = decoded_piece.startswith(" ") or (idx == 0 and not decoded_piece.startswith(" "))
        is_subword_continuation = not is_word_start
        
        # Represent visible whitespace for educational clarity
        raw_display = decoded_piece.replace(" ", "␣")
        if any(ord(c) >= 0x0900 and ord(c) <= 0x097F for c in decoded_piece):
            # Contains Devanagari
            pass
        elif len(byte_piece) > 0 and (byte_piece[0] > 127):
            # Byte fallback token
            hex_repr = " ".join(f"0x{b:02X}" for b in byte_piece)
            raw_display = f"<{hex_repr}>"

        token_items.append({
            "index": idx,
            "id": int(t_id),
            "raw_token": raw_display,
            "decoded_piece": decoded_piece,
            "is_word_start": is_word_start,
            "is_subword_continuation": is_subword_continuation,
            "char_length": len(decoded_piece),
            "byte_length": len(byte_piece),
        })

    words = text.split()
    word_count = len(words) if words else 1
    token_count = len(token_ids)
    char_count = len(text)
    byte_count = len(text.encode("utf-8"))

    return {
        "tokenizer_id": tokenizer_key,
        "name": meta["name"],
        "algorithm": meta["algorithm"],
        "vocab_size": meta["vocab_size"],
        "boundary_marker": meta["boundary_marker"],
        "family": meta["family"],
        "description": meta["description"],
        "indic_efficiency": meta["indic_efficiency"],
        "token_count": token_count,
        "word_count": word_count,
        "char_count": char_count,
        "byte_count": byte_count,
        "token_to_word_ratio": round(token_count / word_count, 2),
        "characters_per_token": round(char_count / max(token_count, 1), 2),
        "bytes_per_token": round(byte_count / max(token_count, 1), 2),
        "tokens": token_items,
    }

def tokenize_single(
    text: str,
    tokenizer_key: str,
    add_special_tokens: bool = False
) -> dict[str, Any]:
    """Tokenize using any of the supported 5 tokenizers."""
    if tokenizer_key == "gpt2":
        return tokenize_hf_model(text, "gpt2", "gpt2", add_special_tokens)
    elif tokenizer_key == "bert_multilingual":
        return tokenize_hf_model(text, "bert_multilingual", "bert-base-multilingual-cased", add_special_tokens)
    elif tokenizer_key == "xlm_roberta":
        return tokenize_hf_model(text, "xlm_roberta", "xlm-roberta-base", add_special_tokens)
    elif tokenizer_key == "tiktoken_cl100k":
        return tokenize_tiktoken_encoding(text, "tiktoken_cl100k", "cl100k_base")
    elif tokenizer_key == "tiktoken_o200k":
        return tokenize_tiktoken_encoding(text, "tiktoken_o200k", "o200k_base")
    else:
        raise ValueError(f"Unknown tokenizer key: {tokenizer_key}")

def compare_all(text: str, add_special_tokens: bool = False) -> dict[str, Any]:
    """Run real tokenization across all 5 benchmark tokenizers side-by-side."""
    results = {}
    for key in ["gpt2", "bert_multilingual", "xlm_roberta", "tiktoken_cl100k", "tiktoken_o200k"]:
        results[key] = tokenize_single(text, key, add_special_tokens)
        
    return {
        "input_text": text,
        "char_count": len(text),
        "word_count": len(text.split()),
        "tokenizers": results
    }
