import io
import csv
from typing import Any, Optional
from app.services.tokenizer_engine import compare_all

DEFAULT_SAMPLE_TEXTS = {
    "english": "Artificial intelligence can help students learn new concepts, practise problem-solving and access information more easily.",
    "hindi": "कृत्रिम बुद्धिमत्ता विद्यार्थियों को नई अवधारणाएँ सीखने, समस्या-समाधान का अभ्यास करने और जानकारी आसानी से प्राप्त करने में मदद कर सकती है।",
    "marathi": "कृत्रिम बुद्धिमत्ता विद्यार्थ्यांना नवीन संकल्पना शिकण्यास, समस्या सोडवण्याचा सराव करण्यास आणि माहिती सहज मिळवण्यास मदत करू शकते।"
}

def generate_multi_language_comparison(
    custom_texts: Optional[dict[str, str]] = None,
    price_per_million_tokens: float = 2.50,
    requests_volume: int = 10000
) -> dict[str, Any]:
    """
    Runs actual tokenization across English, Hindi, and Marathi using all 5 tokenizers,
    computes real metrics, cost projections, and structures data for Recharts visualizations.
    """
    texts = {
        "english": (custom_texts.get("english") if custom_texts and custom_texts.get("english") else DEFAULT_SAMPLE_TEXTS["english"]).strip(),
        "hindi": (custom_texts.get("hindi") if custom_texts and custom_texts.get("hindi") else DEFAULT_SAMPLE_TEXTS["hindi"]).strip(),
        "marathi": (custom_texts.get("marathi") if custom_texts and custom_texts.get("marathi") else DEFAULT_SAMPLE_TEXTS["marathi"]).strip(),
    }

    results_by_lang: dict[str, Any] = {}
    for lang, text in texts.items():
        results_by_lang[lang] = compare_all(text)

    # Recharts data structure 1: Grouped bar chart comparing token count per tokenizer
    # e.g. [{ tokenizer: "GPT-2 (BPE)", English: 21, Hindi: 84, Marathi: 92 }, ...]
    token_comparison_chart: list[dict[str, Any]] = []
    
    # Recharts data structure 2: Grouped bar chart comparing estimated API cost for N requests
    cost_comparison_chart: list[dict[str, Any]] = []

    # Detailed tabular breakdown
    table_rows: list[dict[str, Any]] = []

    tokenizer_order = ["gpt2", "bert_multilingual", "xlm_roberta", "tiktoken_cl100k", "tiktoken_o200k"]

    for tok_id in tokenizer_order:
        en_tok_res = results_by_lang["english"]["tokenizers"][tok_id]
        hi_tok_res = results_by_lang["hindi"]["tokenizers"][tok_id]
        mr_tok_res = results_by_lang["marathi"]["tokenizers"][tok_id]

        tok_name = en_tok_res["name"]
        algorithm = en_tok_res["algorithm"]
        family = en_tok_res["family"]

        en_tokens = en_tok_res["token_count"]
        hi_tokens = hi_tok_res["token_count"]
        mr_tokens = mr_tok_res["token_count"]

        # Cost calculations: (tokens * requests_volume / 1,000,000) * price_per_million
        en_cost = round((en_tokens * requests_volume / 1_000_000.0) * price_per_million_tokens, 4)
        hi_cost = round((hi_tokens * requests_volume / 1_000_000.0) * price_per_million_tokens, 4)
        mr_cost = round((mr_tokens * requests_volume / 1_000_000.0) * price_per_million_tokens, 4)

        token_comparison_chart.append({
            "tokenizerId": tok_id,
            "tokenizerName": tok_name,
            "family": family,
            "English": en_tokens,
            "Hindi": hi_tokens,
            "Marathi": mr_tokens,
            "hindiMultiplier": round(hi_tokens / max(en_tokens, 1), 2),
            "marathiMultiplier": round(mr_tokens / max(en_tokens, 1), 2),
        })

        cost_comparison_chart.append({
            "tokenizerId": tok_id,
            "tokenizerName": tok_name,
            "family": family,
            "EnglishCost": en_cost,
            "HindiCost": hi_cost,
            "MarathiCost": mr_cost,
            "costDisparityHindi": f"{round(hi_cost / max(en_cost, 0.0001), 2)}x",
            "costDisparityMarathi": f"{round(mr_cost / max(en_cost, 0.0001), 2)}x",
        })

        for lang, tok_res in [("English", en_tok_res), ("Hindi", hi_tok_res), ("Marathi", mr_tok_res)]:
            tokens = tok_res["token_count"]
            words = tok_res["word_count"]
            chars = tok_res["char_count"]
            ratio = tok_res["token_to_word_ratio"]
            cost = round((tokens * requests_volume / 1_000_000.0) * price_per_million_tokens, 4)
            multiplier = round(tokens / max(en_tokens, 1), 2)

            table_rows.append({
                "language": lang,
                "tokenizer": tok_name,
                "algorithm": algorithm,
                "family": family,
                "tokenCount": tokens,
                "wordCount": words,
                "charCount": chars,
                "tokenToWordRatio": ratio,
                "charsPerToken": tok_res["characters_per_token"],
                "costForVolume": cost,
                "multiplierVsEnglish": multiplier
            })

    return {
        "pricing_per_million": price_per_million_tokens,
        "requests_volume": requests_volume,
        "texts": texts,
        "token_comparison_chart": token_comparison_chart,
        "cost_comparison_chart": cost_comparison_chart,
        "table_rows": table_rows,
        "raw_results": results_by_lang
    }

def export_comparison_csv(comparison_data: dict[str, Any]) -> str:
    """Exports tabular comparison data as CSV string."""
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        "Language",
        "Tokenizer Name",
        "Algorithm Family",
        "Token Count",
        "Word Count",
        "Character Count",
        "Token-to-Word Ratio",
        "Characters per Token",
        f"Est Cost ({comparison_data['requests_volume']} calls @ ${comparison_data['pricing_per_million']}/1M)",
        "Overhead Multiplier vs English"
    ])

    for row in comparison_data.get("table_rows", []):
        writer.writerow([
            row["language"],
            row["tokenizer"],
            row["family"],
            row["tokenCount"],
            row["wordCount"],
            row["charCount"],
            row["tokenToWordRatio"],
            row["charsPerToken"],
            f"${row['costForVolume']:.4f}",
            f"{row['multiplierVsEnglish']}x"
        ])

    return output.getvalue()
