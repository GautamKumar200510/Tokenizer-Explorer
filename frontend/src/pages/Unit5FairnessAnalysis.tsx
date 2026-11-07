import React, { useState, useEffect } from 'react';
import {
  Scale,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Clock,
  Minimize2,
  BookOpen,
  DollarSign,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { SampleTextSelector, OFFICIAL_SAMPLES } from '../components/SampleTextSelector';
import { apiClient } from '../services/api';
import type { FairnessAnalysisResponse } from '../types';

export const Unit5FairnessAnalysis: React.FC = () => {
  const [fairnessData, setFairnessData] = useState<FairnessAnalysisResponse | null>(null);
  const [geminiReport, setGeminiReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [pricing, setPricing] = useState(2.50);
  const [contextWindow, setContextWindow] = useState(128000);

  const loadFairness = async (price: number, windowSize: number) => {
    try {
      setIsLoading(true);
      const res = await apiClient.getFairnessAnalysis(undefined, price, windowSize);
      setFairnessData(res);
    } catch (err) {
      console.error('Failed to load fairness metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFairness(pricing, contextWindow);
  }, []);

  const handleGenerateGeminiReport = async () => {
    try {
      setIsGeneratingAi(true);
      const res = await apiClient.getGeminiFairnessReport(undefined, pricing);
      setGeminiReport(res.ai_report?.report_markdown || 'No report generated');
    } catch (err) {
      console.error('Gemini fairness report error:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                UNIT 5
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Cost Fairness & The "Token Tax" for Indian Languages
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Examining systemic algorithmic inequality: token inflation, context window degradation, latency penalties, and financial disparity on Indic languages.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateGeminiReport}
            disabled={isGeneratingAi || !fairnessData}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2 self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGeneratingAi ? 'Synthesizing Policy Report...' : 'Generate Gemini Fairness Report'}
          </button>
        </div>

        {/* Executive summary banner */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-rose-50 via-amber-50 to-purple-50 border border-rose-200/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              The Reality of The "Indic Token Tax"
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Because foundation model APIs charge per token rather than per semantic unit (word or meaning),
              organizations running Indian language applications pay up to <strong>3.5x to 4.5x more</strong> for the same
              tasks than English users. Simultaneously, an identical prompt consumes ~3x more context memory, drastically shrinking effective document retrieval in RAG systems.
            </p>
          </div>
        </div>
      </div>

      {fairnessData && (
        <div className="space-y-6">
          {/* Key Impact Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Hindi Token Tax (GPT-4)"
              value={fairnessData.key_takeaways.token_tax_hindi_gpt4}
              subtitle="Compared to English equivalent text"
              badge="Financial Overhead"
              badgeColor="rose"
              icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
            />
            <StatCard
              title="Marathi Token Tax (GPT-4)"
              value={fairnessData.key_takeaways.token_tax_marathi_gpt4}
              subtitle="Compared to English equivalent text"
              badge="Financial Overhead"
              badgeColor="rose"
              icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
            />
            <StatCard
              title="Effective Context Loss (Hindi)"
              value={fairnessData.key_takeaways.context_window_penalty_hindi}
              subtitle="Loss in words that can fit in 128k prompt"
              badge="Memory Shrinkage"
              badgeColor="amber"
              icon={<Minimize2 className="w-4 h-4 text-amber-500" />}
            />
            <StatCard
              title="Effective Context Loss (Marathi)"
              value={fairnessData.key_takeaways.context_window_penalty_marathi}
              subtitle="Loss in words that can fit in 128k prompt"
              badge="Memory Shrinkage"
              badgeColor="amber"
              icon={<Minimize2 className="w-4 h-4 text-amber-500" />}
            />
          </div>

          {/* AI Fairness Report View if requested */}
          {geminiReport && (
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 border border-purple-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Gemini Foundation Model Fairness Report
                </h3>
                <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  Policy & Technical Brief
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-slate-700 font-sans leading-relaxed whitespace-pre-wrap">
                {geminiReport}
              </div>
            </div>
          )}

          {/* Three Key Pillars: Cost, Context, and Latency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: Cost Disparity */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-600">
                <DollarSign className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-900">1. Economic Cost Disparity</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an educational tutoring app processes 10,000 student queries per day:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">English:</span>
                  <span className="font-bold text-blue-700">$0.53 / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hindi:</span>
                  <span className="font-bold text-amber-700">$1.88 / day (3.5x)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Marathi:</span>
                  <span className="font-bold text-rose-700">$2.25 / day (4.2x)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Indian EdTech startups and developers pay a severe structural penalty simply for building in their native languages.
              </p>
            </div>

            {/* Pillar 2: Context Window Shrinkage */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-600">
                <Minimize2 className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-900">2. Context Window Shrinkage</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In an LLM with a 128,000 token context window (e.g. GPT-4, Llama 3):
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">English Document:</span>
                  <span className="font-bold text-blue-700">~106,000 words</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hindi Document:</span>
                  <span className="font-bold text-amber-700">~36,000 words (-66%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Marathi Document:</span>
                  <span className="font-bold text-rose-700">~30,000 words (-71%)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                RAG document chunks and legal texts get truncated 3x earlier for Indian languages.
              </p>
            </div>

            {/* Pillar 3: Generation Latency Tax */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <Clock className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-900">3. Generation Latency Tax</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                LLM text generation is autoregressive: each token requires a distinct forward pass through all transformer layers:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">100 English words:</span>
                  <span className="font-bold text-blue-700">~125 passes (~2.5s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">100 Hindi words:</span>
                  <span className="font-bold text-amber-700">~420 passes (~8.4s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">100 Marathi words:</span>
                  <span className="font-bold text-rose-700">~480 passes (~9.6s)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Inference feels ~3.5x slower for regional language users on interactive chat platforms.
              </p>
            </div>
          </div>

          {/* Root Technical Causes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Why Does Unequal Tokenization Occur? (Root Technical Causes)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The confluence of Unicode byte structures, script linguistics, and web corpus biases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fairnessData.linguistic_reasons.map((r, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                    {r.factor}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {r.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Engineering Recommendations */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Actionable Engineering & Policy Recommendations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Best practices for software engineers, NLP practitioners, and AI policymakers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fairnessData.engineering_recommendations.map((rec, idx) => (
                <div key={idx} className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
