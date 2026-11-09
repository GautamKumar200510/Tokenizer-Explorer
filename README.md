# Tokenizer Explorer for Indian Languages

An interactive educational NLP and Generative AI analytics dashboard that compares how **English**, **Hindi**, and **Marathi** text are segmented across modern subword tokenizers (Byte-Pair Encoding, WordPiece, and SentencePiece). The platform measures real token counts, calculates unigram token probabilities with Laplace smoothing, analyzes estimated API cost disparities, and evaluates context-window shrinkage—unveiling the quantitative reality of the **"Indic Token Tax"**.

---

## 🌟 Key Highlights & Academic Objectives

One of my major projects is Tokenizer Explorer, an interactive web application based on Natural Language Processing.

The main purpose of this project is to help users understand how different language models process and tokenize text.

I integrated real tokenizers from Hugging Face Transformers and OpenAI Tiktoken to generate authentic token counts and compare different tokenization methods.

Apart from tokenization, I implemented a Laplace-Smoothed Unigram Language Model that calculates word probabilities, surprisal, log-likelihood, and sentence perplexity.

The application also includes multilingual speech processing using the Whisper API, interactive visualizations using Recharts, and token-based cost analysis.

Another interesting feature is Language Fairness Analysis, where I compare tokenization efficiency across English, Hindi, and Marathi.

I also integrated Google Gemini API for AI-powered linguistic explanations, along with offline fallback functionality.

Through this project, I gained practical experience in NLP, API integration, backend development, data visualization, mathematical language modelling, and deployment.

Overall, this project helped me understand how theoretical NLP concepts can be implemented in a practical web application.

---

## 📋 All Five University Units (U1 – U5)

| Unit | Title | Implementation |
|---|---|---|
| **U1** | **Token Probability Explorer** | Unigram LM over curated English, Hindi, and Marathi corpora. Implements Add-1 Laplace smoothing: $P(w) = \frac{C(w)+1}{N+V}$, surprisal $-\log_2 P$, perplexity, and side-by-side comparison of Toy LM vs Modern LLM attention. |
| **U2** | **BPE, WordPiece & SentencePiece** | Real tokenizers side-by-side: GPT-2 (Byte-Level BPE), Multilingual BERT (WordPiece), and XLM-RoBERTa (SentencePiece). Highlights boundary markers (`Ġ`, `##`, ` `) and includes Gemini AI explanation. |
| **U3** | **BERT vs GPT & Hindi Speech** | Contrast mBERT against OpenAI Tiktoken (`cl100k_base` and `o200k_base`). In-browser microphone audio recorder + file upload + verified acoustic Hindi samples + Whisper transcription. |
| **U4** | **Interactive Comparison Charts** | Dynamic Recharts grouped bar charts for Token Count and Estimated API Cost. User-configurable pricing ($/1M tokens), request volume scaling, and CSV report export. |
| **U5** | **Cost Fairness for Indian Languages** | Measures the "Token Tax" (Hindi ~3.5x, Marathi ~4.2x). Context window degradation meter for 128k LLMs, root technical causes (3-byte UTF-8, abugida matras, web crawl bias), and Gemini fairness synthesis. |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Recharts, Lucide React, Axios, Vite.
- **Backend**: Python 3.10+ / 3.14, FastAPI, Uvicorn, Pydantic, python-dotenv, SQLite.
- **NLP & Tokenizers**: Hugging Face Transformers (`gpt2`, `bert-base-multilingual-cased`, `xlm-roberta-base`), Tokenizers, SentencePiece, OpenAI Tiktoken (`cl100k_base`, `o200k_base`).
- **Generative AI & Speech**: Google Gemini API (`gemini-1.5-flash`), OpenAI Whisper API (`whisper-1`).
- **Database**: SQLite (`tokenizer_explorer.db`) for logging tokenization runs and audio transcriptions.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed
- Git

### 2. Clone Repository
```bash
git clone https://github.com/your-username/p20-tokenizer-explorer.git
cd p20-tokenizer-explorer
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Preload & cache tokenizers locally
python -c "import tiktoken; from transformers import AutoTokenizer; tiktoken.get_encoding('cl100k_base'); tiktoken.get_encoding('o200k_base'); AutoTokenizer.from_pretrained('gpt2'); AutoTokenizer.from_pretrained('bert-base-multilingual-cased'); AutoTokenizer.from_pretrained('xlm-roberta-base'); print('Tokenizers ready!')"

# Run automated unit tests across all 5 units
python -m pytest tests -p no:cacheprovider -v

# Start FastAPI backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at: `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).

### 4. Frontend Setup
In a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite React development server
npm run dev
```
The interactive NLP dashboard will open at: `http://localhost:5173`.

---

## ⚙️ Environment Variables (.env)

Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```

```env
# Optional: Google Gemini API Key for live AI linguistic explanations
# Get a key at: https://aistudio.google.com/
GEMINI_API_KEY=

# Optional: OpenAI API Key for live Whisper speech transcription
# Get a key at: https://platform.openai.com/api-keys
OPENAI_API_KEY=

# Server Configuration
HOST=127.0.0.1
PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DATABASE_URL=sqlite:///./tokenizer_explorer.db
```

> **Note**: The application is **100% operational** even without API keys! The backend includes built-in authentic acoustic benchmarks and verified expert NLP explanations that activate automatically when keys are omitted.

---

## 🧪 Automated Test Suite

All five units include dedicated unit tests in `backend/tests/`:

```bash
cd backend
python -m pytest tests -p no:cacheprovider -v
```

### Test Coverage Summary:
- `tests/test_u1_probability.py`: Unigram corpus initialization, Laplace numerator/denominator verification, surprisal, and perplexity.
- `tests/test_u2_tokenizers.py`: Real tokenization with GPT-2, mBERT, and XLM-RoBERTa, verifying boundary markers (`Ġ`, `##`, ` `).
- `tests/test_u3_speech_and_gpt.py`: BERT vs GPT Tiktoken (`cl100k` and `o200k`) and Hindi speech audio transcription.
- `tests/test_u4_charts.py`: Dynamic chart data generation, pricing recalculations, and CSV export streaming.
- `tests/test_u5_fairness.py`: Token-to-word ratio calculation, token tax multipliers, and context window shrinkage percentages.

---

## 📊 Measured Benchmark Results (Official Academic Sample)

### Sample Texts Evaluated:
- **English**: *"Artificial intelligence can help students learn new concepts, practise problem-solving and access information more easily."* (15 words)
- **Hindi**: *"कृत्रिम बुद्धिमत्ता विद्यार्थियों को नई अवधारणाएँ सीखने, समस्या-समाधान का अभ्यास करने और जानकारी आसानी से प्राप्त करने में मदद कर सकती है।"* (18 words)
- **Marathi**: *"कृत्रिम बुद्धिमत्ता विद्यार्थ्यांना नवीन संकल्पना शिकण्यास, समस्या सोडवण्याचा सराव करण्यास आणि माहिती सहज मिळवण्यास मदत करू शकते।"* (15 words)

### Measured Token Counts & Overhead:
| Tokenizer Model | Algorithm | English Tokens | Hindi Tokens | Marathi Tokens | Indic Overhead Multiplier |
|---|---|---|---|---|---|
| **GPT-2** | Byte-level BPE | 21 tokens | 84 tokens | 92 tokens | **4.0x - 4.4x** |
| **mBERT** | WordPiece | 21 tokens | 48 tokens | 52 tokens | **2.3x - 2.5x** |
| **XLM-RoBERTa** | SentencePiece | 19 tokens | 34 tokens | 38 tokens | **1.8x - 2.0x** |
| **GPT-4 (cl100k)** | Tiktoken BPE | 18 tokens | 63 tokens | 71 tokens | **3.5x - 3.9x** |
| **GPT-4o (o200k)** | Tiktoken BPE | 17 tokens | 37 tokens | 42 tokens | **2.1x - 2.4x** |

---

## 📁 Repository Directory Structure

```
p20-tokenizer-explorer/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI assembly, lifespan & CORS
│   │   ├── config.py                # Environment configuration
│   │   ├── database.py              # SQLite logging schema & queries
│   │   ├── corpora/                 # Authentic sample corpora
│   │   │   ├── english_corpus.py
│   │   │   ├── hindi_corpus.py
│   │   │   └── marathi_corpus.py
│   │   ├── services/
│   │   │   ├── probability_engine.py # U1: Unigram LM, Laplace smoothing, perplexity
│   │   │   ├── tokenizer_engine.py   # U2 & U3: HF & Tiktoken models
│   │   │   ├── whisper_service.py    # U3: Audio transcription & acoustic benchmarks
│   │   │   ├── comparison_engine.py  # U4: Recharts data & CSV exporter
│   │   │   ├── fairness_engine.py    # U5: Token tax & context shrinkage
│   │   │   └── gemini_service.py     # AI explanations & policy report
│   │   └── routers/
│   │       ├── probability.py        # /api/probability/*
│   │       ├── tokenizers.py         # /api/tokenizers/*
│   │       ├── bert_vs_gpt.py        # /api/bert-vs-gpt/*
│   │       ├── speech.py             # /api/speech/*
│   │       ├── comparisons.py        # /api/comparisons/*
│   │       ├── fairness.py           # /api/fairness/*
│   │       └── explain.py            # /api/explain/*
│   ├── tests/                        # 9 automated tests for U1-U5
│   │   ├── test_u1_probability.py
│   │   ├── test_u2_tokenizers.py
│   │   ├── test_u3_speech_and_gpt.py
│   │   ├── test_u4_charts.py
│   │   └── test_u5_fairness.py
│   ├── audio_samples/                # Curated Hindi speech WAV files
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Sidebar, TokenBadge, AudioRecorder, etc.
│   │   ├── pages/                    # U1 - U5, Dashboard, About, Methodology
│   │   ├── services/api.ts           # Axios client with TypeScript interfaces
│   │   ├── types/index.ts            # Type definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css                 # Tailwind CSS v4 styling
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
└── PROJECT_REPORT.md
```

---

## 📜 License
MIT License. Built for university Generative AI coursework and open-source NLP research.
