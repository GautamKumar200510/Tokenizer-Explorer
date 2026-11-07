import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  BarChart2,
  Scale,
  Mic2,
  Dice5,
  Layers,
  ChevronRight,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import type { TabId } from '../components/Sidebar';
import { SampleTextSelector, OFFICIAL_SAMPLES } from '../components/SampleTextSelector';
import { StatCard } from '../components/StatCard';
import { TokenBadge } from '../components/TokenBadge';
import { apiClient } from '../services/api';
import type { CompareAllResponse, Language } from '../types';

interface DashboardOverviewProps {
  onNavigate: (tab: TabId) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('hindi');
  const [inputText, setInputText] = useState(OFFICIAL_SAMPLES.hindi.text);
  const [quickResults, setQuickResults] = useState<CompareAllResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runQuickBenchmark = async (textToRun: string) => {
    try {
      setIsLoading(true);
      const res = await apiClient.compareTokenizers(textToRun);
      setQuickResults(res);
    } catch (err) {
      console.error('Quick benchmark error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (text: string, lang: Language) => {
    setSelectedLanguage(lang);
    setInputText(text);
    runQuickBenchmark(text);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Generative AI CA Mini Project
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
            P20 – Tokenizer Explorer for Indian Languages
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            An interactive educational research platform comparing how <strong>English</strong>,{' '}
            <strong>Hindi</strong>, and <strong>Marathi</strong> text are segmented across Byte-Pair
            Encoding (BPE), WordPiece, and SentencePiece. Unveiling token probabilities, context window
            impact, and the real-world economic <em>"Token Tax"</em> on Indic scripts.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('u2_tokenizers')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Real Tokenizers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('u5_fairness')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <span>View Language Tax Analysis</span>
              <Scale className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>
      </div>

      {/* High-level KPI summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="English Token-to-Word Ratio"
          value="~1.2"
          subtitle="Highly efficient compression on ASCII"
          badge="Baseline (1.0x)"
          badgeColor="emerald"
        />
        <StatCard
          title="Hindi Token Inflation"
          value="3.5x - 4.2x"
          subtitle="Tokens per word in legacy BPE & cl100k"
          badge="+250% Overhead"
          badgeColor="amber"
          icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          title="Marathi Token Inflation"
          value="4.0x - 5.0x"
          subtitle="Complex inflections & matra splits"
          badge="+300% Overhead"
          badgeColor="rose"
          icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
        />
        <StatCard
          title="GPT-4o (o200k) Efficiency Gain"
          value="~45-60%"
          subtitle="Token reduction via 200k vocabulary"
          badge="Newest Breakthrough"
          badgeColor="purple"
          icon={<TrendingDown className="w-4 h-4 text-purple-600" />}
        />
      </div>

      {/* University Units Jump Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Five University Project Modules (U1 - U5)
          </h3>
          <span className="text-xs text-slate-500 font-medium">All units fully implemented with real NLP engines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* U1 */}
          <div
            onClick={() => onNavigate('u1_probability')}
            className="group p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  UNIT 1
                </span>
                <Dice5 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Token Probability Explorer
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Unigram language model with Laplace (Add-1) smoothing, step-by-step probability calculation, surprisal, and perplexity.
              </p>
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-indigo-600">
              <span>Launch Explorer</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* U2 */}
          <div
            onClick={() => onNavigate('u2_tokenizers')}
            className="group p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                  UNIT 2
                </span>
                <Layers className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition">
                BPE, WordPiece & SentencePiece
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Side-by-side comparison of real HuggingFace tokenizers (GPT-2, mBERT, XLM-R) with boundary glyphs and Gemini AI explanations.
              </p>
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-purple-600">
              <span>Compare Algorithms</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* U3 */}
          <div
            onClick={() => onNavigate('u3_speech')}
            className="group p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  UNIT 3
                </span>
                <Mic2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                BERT vs GPT & Hindi Speech
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Direct contrast of mBERT vs OpenAI Tiktoken (cl100k/o200k) + Hindi audio recording and Whisper speech transcription.
              </p>
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-blue-600">
              <span>Transcribe & Contrast</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* U4 */}
          <div
            onClick={() => onNavigate('u4_charts')}
            className="group p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  UNIT 4
                </span>
                <BarChart2 className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition">
                Interactive Comparison Charts
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Recharts token count & cost bar charts, customizable pricing per 1M tokens, volume forecasting, and CSV export.
              </p>
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-teal-600">
              <span>View Analytics</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* U5 */}
          <div
            onClick={() => onNavigate('u5_fairness')}
            className="group p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  UNIT 5
                </span>
                <Scale className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition">
                Language Cost Fairness
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Quantifying the "Token Tax", effective context window shrinkage, root linguistic causes, and Gemini AI fairness report.
              </p>
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-rose-600">
              <span>Inspect Equity</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Methodology */}
          <div
            onClick={() => onNavigate('methodology')}
            className="group p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xs hover:border-slate-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-indigo-300 bg-slate-800 px-2 py-0.5 rounded">
                  THEORY
                </span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                Methodology & Mathematics
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Mathematical formulas, BPE merge rules, WordPiece likelihood criteria, SentencePiece loss, and academic references.
              </p>
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-indigo-400">
              <span>Read NLP Theory</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Benchmark Tester */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Live Interactive Benchmark Tester
            </h3>
            <p className="text-xs text-slate-500">
              Select one of the official benchmark paragraphs below to run all 5 tokenizers instantly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => runQuickBenchmark(inputText)}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isLoading ? 'Tokenizing with Models...' : 'Run All 5 Tokenizers'}
          </button>
        </div>

        <SampleTextSelector
          selectedLanguage={selectedLanguage}
          onSelectSample={handleSelectSample}
        />

        {/* Quick Result Snapshot */}
        {quickResults && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Measured Token Counts on Selected Text:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {Object.entries(quickResults.tokenizers).map(([key, data]) => (
                <div
                  key={key}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-center"
                >
                  <span className="text-[10px] uppercase font-mono text-slate-500 block truncate">
                    {data.family}
                  </span>
                  <span className="text-xl font-bold font-mono text-slate-900 block my-0.5">
                    {data.token_count}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-600 block truncate">
                    {data.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {data.token_to_word_ratio} tok/word
                  </span>
                </div>
              ))}
            </div>

            {/* Token preview chips for SentencePiece and GPT-4o */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Token Decomposition Preview (SentencePiece / XLM-RoBERTa):
              </span>
              <div className="flex flex-wrap gap-1">
                {quickResults.tokenizers.xlm_roberta.tokens.slice(0, 20).map((t) => (
                  <TokenBadge key={t.index} token={t} />
                ))}
                {quickResults.tokenizers.xlm_roberta.tokens.length > 20 && (
                  <span className="text-xs text-slate-400 self-center px-2 font-mono">
                    +{quickResults.tokenizers.xlm_roberta.tokens.length - 20} more...
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
