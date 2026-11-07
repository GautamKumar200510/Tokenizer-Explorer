import React from 'react';
import {
  Sparkles,
  Layers,
  Cpu,
  Database,
  Code2,
  Globe2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
            PROJECT OVERVIEW
          </span>
          <span className="text-xs font-mono text-slate-500">P20 Academic Mini Project</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          P20 – Tokenizer Explorer for Indian Languages
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          An interactive, high-precision educational web application built to analyze and demonstrate how
          Indian languages (Hindi and Marathi) are processed by modern subword tokenizers in comparison to English.
        </p>
      </div>

      {/* Goal & Motivation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Core Academic Goals
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>U1:</strong> Implement Unigram Language Modeling with Laplace (Add-1) smoothing, step-by-step math, and perplexity.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>U2:</strong> Real tokenizer comparison across GPT-2 BPE, mBERT WordPiece, and XLM-R SentencePiece with boundary markers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>U3:</strong> Real BERT vs OpenAI Tiktoken (cl100k/o200k) + Hindi audio recording and Whisper speech transcription.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>U4:</strong> Dynamic Recharts bar charts comparing token counts, user-controlled pricing per 1M tokens, and CSV export.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>U5:</strong> Quantitative analysis of the "Token Tax", context window shrinkage, latency, and Gemini AI fairness synthesis.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-purple-600" />
            Why This Research Matters
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Over 600 million people speak Hindi and Marathi, yet modern foundation models were predominantly trained on English web corpora.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Because Devanagari characters require 3 bytes in UTF-8 and feature complex conjuncts (aksharas), tokenizers that lack adequate Indic training data fragment words into tiny byte pieces.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            This project provides visual, measurable proof of this disparity, enabling students, educators, and engineers to explore the computational and financial realities of multilingual AI.
          </p>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Full Technology Stack
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Frontend</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">React + TS</span>
            <span className="text-[11px] text-indigo-600">Tailwind CSS v4</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Backend</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">Python FastAPI</span>
            <span className="text-[11px] text-indigo-600">Uvicorn + Pydantic</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">NLP Tokenizers</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">Transformers</span>
            <span className="text-[11px] text-indigo-600">Tiktoken + HF</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Generative AI</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">Google Gemini</span>
            <span className="text-[11px] text-indigo-600">Linguistic Reports</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Speech-to-Text</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">OpenAI Whisper</span>
            <span className="text-[11px] text-indigo-600">Audio Transcription</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Visualization</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">Recharts</span>
            <span className="text-[11px] text-indigo-600">SQLite History</span>
          </div>
        </div>
      </div>
    </div>
  );
};
