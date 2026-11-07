import re
import math
from collections import Counter
from typing import Any
from app.corpora import CORPUS_REGISTRY

# Regex to cleanly tokenize text while preserving words and punctuation
TOKEN_REGEX = re.compile(r"[\w]+|[^\w\s]", re.UNICODE)

class UnigramLanguageModel:
    """
    Unigram Language Model with Laplace (Add-1) Smoothing.
    Maintains authentic counts across English, Hindi, and Marathi corpora.
    """

    def __init__(self, language: str = "english"):
        self.language = language.lower()
        corpus_sentences = CORPUS_REGISTRY.get(self.language, CORPUS_REGISTRY["english"])
        
        # Tokenize the entire corpus
        self.corpus_tokens: list[str] = []
        for sentence in corpus_sentences:
            tokens = self.tokenize(sentence)
            self.corpus_tokens.extend(tokens)
            
        self.token_counts = Counter(self.corpus_tokens)
        self.total_tokens_N: int = len(self.corpus_tokens)
        self.vocabulary: set[str] = set(self.token_counts.keys())
        self.vocab_size_V: int = len(self.vocabulary)

    @staticmethod
    def tokenize(text: str) -> list[str]:
        """Unicode-aware tokenization splitting on words and punctuation."""
        return TOKEN_REGEX.findall(text)

    def calculate_token_probability(self, token: str) -> dict[str, Any]:
        """
        Calculate Laplace-smoothed probability for a single token:
        P_Laplace(w) = (Count(w) + 1) / (N + V)
        """
        raw_count = self.token_counts.get(token, 0)
        numerator = raw_count + 1
        denominator = self.total_tokens_N + self.vocab_size_V
        prob = numerator / denominator
        
        # Surprisal / Information content in bits: -log2(P)
        surprisal_bits = -math.log2(prob)
        # Negative log-likelihood (natural log): -ln(P)
        nll = -math.log(prob)
        
        is_oov = raw_count == 0
        
        return {
            "token": token,
            "raw_count": raw_count,
            "numerator": numerator,
            "denominator": denominator,
            "probability": prob,
            "probability_formatted": f"{prob:.6f}",
            "surprisal_bits": round(surprisal_bits, 4),
            "nll": round(nll, 4),
            "is_oov": is_oov,
            "formula_string": f"({raw_count} + 1) / ({self.total_tokens_N} + {self.vocab_size_V}) = {numerator} / {denominator} ≈ {prob:.6f}",
            "corpus_stats": {
                "total_tokens_N": self.total_tokens_N,
                "vocab_size_V": self.vocab_size_V
            }
        }

    def analyze_sentence(self, text: str) -> dict[str, Any]:
        """
        Analyze a complete sentence with the unigram model:
        Returns individual token probabilities, overall sequence log-likelihood,
        and perplexity.
        """
        tokens = self.tokenize(text)
        if not tokens:
            return {
                "tokens": [],
                "total_tokens": 0,
                "sequence_log_likelihood": 0.0,
                "perplexity": 0.0,
                "corpus_info": {
                    "language": self.language,
                    "total_tokens_N": self.total_tokens_N,
                    "vocab_size_V": self.vocab_size_V,
                }
            }

        token_analyses = []
        total_log_prob = 0.0
        total_log2_prob = 0.0

        for idx, t in enumerate(tokens):
            analysis = self.calculate_token_probability(t)
            analysis["index"] = idx
            token_analyses.append(analysis)
            
            p = analysis["probability"]
            total_log_prob += math.log(p)
            total_log2_prob += math.log2(p)

        m = len(tokens)
        avg_neg_log2 = -(total_log2_prob / m)
        perplexity = math.pow(2, avg_neg_log2)

        return {
            "language": self.language,
            "input_text": text,
            "tokens": token_analyses,
            "total_tokens": m,
            "vocabulary_size_V": self.vocab_size_V,
            "corpus_token_count_N": self.total_tokens_N,
            "sequence_log_likelihood": round(total_log_prob, 4),
            "cross_entropy_bits_per_token": round(avg_neg_log2, 4),
            "perplexity": round(perplexity, 2),
            "smoothing_formula": {
                "name": "Laplace Smoothing (Add-1)",
                "latex": r"P_{\text{Laplace}}(w) = \frac{C(w) + 1}{N + V}",
                "description": "Prevents zero probability for unseen words by adding a pseudo-count of 1 to every vocabulary word and normalising by (N + V).",
                "perplexity_formula": r"PP(W) = \exp\left(-\frac{1}{m} \sum_{i=1}^m \ln P(w_i)\right) = 2^{-\frac{1}{m} \sum_{i=1}^m \log_2 P(w_i)}"
            },
            "toy_vs_llm_comparison": {
                "toy_model": {
                    "architecture": "Unigram Language Model (Bag of Words)",
                    "context_handling": "Zero context awareness. Assumes words are conditionally independent: P(w1...wm) = ∏ P(wi).",
                    "probability_source": "Static frequency counts derived from the small sample corpus with add-1 Laplace smoothing.",
                    "vocabulary": f"{self.vocab_size_V} distinct words from domain corpus.",
                    "computational_cost": "O(1) dictionary lookup per word."
                },
                "modern_llm": {
                    "architecture": "Deep Autoregressive Transformer (Decoder-only / Encoder-Decoder)",
                    "context_handling": "Full contextual attention. Probability of each token is strictly conditioned on all preceding tokens: P(wi | w1...wi-1).",
                    "probability_source": "Softmax distribution over logits computed from high-dimensional learned vector embeddings, multi-head self-attention, and MLP layers.",
                    "vocabulary": "50,000 to 200,000+ subword units (BPE, WordPiece, SentencePiece).",
                    "computational_cost": "Billions to trillions of floating-point operations (FLOPs) using GPU/TPU matrix accelerators."
                }
            }
        }

# Global instances per language
probability_engines = {
    "english": UnigramLanguageModel("english"),
    "hindi": UnigramLanguageModel("hindi"),
    "marathi": UnigramLanguageModel("marathi"),
}

def get_probability_engine(language: str) -> UnigramLanguageModel:
    lang = language.lower()
    if lang not in probability_engines:
        probability_engines[lang] = UnigramLanguageModel(lang)
    return probability_engines[lang]
