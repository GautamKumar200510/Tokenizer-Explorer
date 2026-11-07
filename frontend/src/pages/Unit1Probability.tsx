import React, { useState, useEffect } from 'react';
import {
  Dice5,
  Sparkles,
  RotateCcw,
  BookOpen,
  Info,
  Layers,
  ArrowRight,
  TrendingDown,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { SampleTextSelector, OFFICIAL_SAMPLES } from '../components/SampleTextSelector';
import { StatCard } from '../components/StatCard';
import { apiClient } from '../services/api';
import type { Language, ProbabilityAnalysisResponse, SingleTokenProbability } from '../types';

export const Unit1Probability: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('hindi');
  const [inputText, setInputText] = useState(OFFICIAL_SAMPLES.hindi.text);
  const [analysis, setAnalysis] = useState<ProbabilityAnalysisResponse | null>(null);
  const [selectedToken, setSelectedToken] = useState<SingleTokenProbability | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runAnalysis = async (textToAnalyze: string, lang: Language) => {
    if (!textToAnalyze.trim()) return;
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await apiClient.analyzeProbability(textToAnalyze, lang);
      setAnalysis(res);
      if (res.tokens.length > 0) {
        setSelectedToken(res.tokens[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || err.message || 'Probability calculation failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis(inputText, selectedLanguage);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setSelectedLanguage(newLang);
    const newText = OFFICIAL_SAMPLES[newLang].text;
    setInputText(newText);
    runAnalysis(newText, newLang);
  };

  const handleSelectSample = (sampleText: string, lang: Language) => {
    setSelectedLanguage(lang);
    setInputText(sampleText);
    runAnalysis(sampleText, lang);
  };

  const handleReset = () => {
    const defaultText = OFFICIAL_SAMPLES[selectedLanguage].text;
    setInputText(defaultText);
    runAnalysis(defaultText, selectedLanguage);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                UNIT 1
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Token Probability Explorer
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Explore Unigram Language Model probabilities with Add-1 Laplace smoothing across English, Hindi, and Marathi corpora.
            </p>
          </div>

          {/* Language Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            {(['english', 'hindi', 'marathi'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'hindi' ? 'Hindi (हिन्दी)' : lang === 'marathi' ? 'Marathi (मराठी)' : 'English'}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="mt-4 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Input Sentence to Analyze:
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3.5 border border-slate-300 rounded-xl text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs leading-relaxed"
            placeholder="Type or paste English, Hindi, or Marathi text here..."
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {inputText.length} characters • {inputText.split(/\s+/).filter(Boolean).length} words
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Sample
              </button>
              <button
                type="button"
                onClick={() => runAnalysis(inputText, selectedLanguage)}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isLoading ? 'Calculating Probabilities...' : 'Calculate Probabilities'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preset sample buttons */}
      <SampleTextSelector
        selectedLanguage={selectedLanguage}
        onSelectSample={handleSelectSample}
      />

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          {errorMsg}
        </div>
      )}

      {analysis && (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              title="Sentence Perplexity (PP)"
              value={analysis.perplexity.toFixed(1)}
              subtitle="Geometric mean branching factor"
              badge={analysis.perplexity < 100 ? 'Good Fit' : 'High Surprisal'}
              badgeColor={analysis.perplexity < 100 ? 'emerald' : 'amber'}
            />
            <StatCard
              title="Sequence Log-Likelihood"
              value={analysis.sequence_log_likelihood.toFixed(2)}
              subtitle="Natural log-sum of tokens"
              badge="∑ ln P(w)"
              badgeColor="indigo"
            />
            <StatCard
              title="Corpus Vocabulary (V)"
              value={analysis.vocabulary_size_V}
              subtitle="Unique vocabulary words in corpus"
              badge={selectedLanguage.toUpperCase()}
              badgeColor="purple"
            />
            <StatCard
              title="Total Tokens in Corpus (N)"
              value={analysis.corpus_token_count_N}
              subtitle="Total words in training domain"
              badge="Domain Size"
              badgeColor="slate"
            />
          </div>

          {/* Interactive Token Decomposition Chips */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Dice5 className="w-4 h-4 text-indigo-600" />
                  Decomposed Sentence Tokens ({analysis.total_tokens} tokens)
                </h3>
                <p className="text-xs text-slate-500">
                  Click any colored token box to inspect its exact frequency, Laplace smoothing calculation, and surprisal.
                </p>
              </div>
              <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Click token to inspect formula
              </span>
            </div>

            {/* Token Chips */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex flex-wrap gap-2">
              {analysis.tokens.map((t, idx) => {
                const isSelected = selectedToken?.token === t.token && selectedToken?.index === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedToken({ ...t, index: idx })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-sans font-semibold border transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-105 ring-2 ring-indigo-400/30'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                    }`}
                  >
                    <span className="text-xs opacity-60 font-mono">#{idx + 1}</span>
                    <span>{t.token}</span>
                    <span
                      className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                        isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      P={t.probability.toFixed(4)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Token Math Breakdown Card */}
            {selectedToken && (
              <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-slate-50 border border-indigo-200/80 rounded-xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                      Step-by-Step Probability Calculation for:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white border border-indigo-300 font-bold text-indigo-950 font-sans text-sm">
                      "{selectedToken.token}"
                    </span>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border self-start sm:self-auto ${
                      selectedToken.is_oov
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {selectedToken.is_oov ? '⚠️ Unseen Word (Zero-Frequency in Corpus)' : '✓ In-Corpus Vocabulary'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                      Raw Corpus Frequency C(w)
                    </span>
                    <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                      {selectedToken.raw_count} occurrences
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Count in {selectedLanguage} sample corpus
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                      Laplace Smoothed Probability P(w)
                    </span>
                    <span className="text-xl font-bold font-mono text-indigo-700 mt-1 block">
                      {selectedToken.probability_formatted}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedToken.numerator} / {selectedToken.denominator}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                      Information Content / Surprisal
                    </span>
                    <span className="text-xl font-bold font-mono text-purple-700 mt-1 block">
                      {selectedToken.surprisal_bits} bits
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      -log₂(P(w)) bits of surprise
                    </span>
                  </div>
                </div>

                {/* Mathematical Equation Box */}
                <div className="bg-white p-4 rounded-lg border border-indigo-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Mathematical Evaluation:
                  </span>
                  <div className="p-3 bg-slate-900 text-indigo-200 rounded font-mono text-xs overflow-x-auto">
                    {selectedToken.formula_string}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Explanation:</strong> Under Add-1 Laplace smoothing, even if the word{' '}
                    <em>"{selectedToken.token}"</em> has count <strong>0</strong>, its numerator becomes{' '}
                    <code>0 + 1 = 1</code>. The denominator is adjusted by adding the total vocabulary size{' '}
                    <code>V = {analysis.vocabulary_size_V}</code> to total tokens <code>N = {analysis.corpus_token_count_N}</code>{' '}
                    yielding <code>{selectedToken.denominator}</code>, strictly guaranteeing non-zero probability.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Educational Callout: Toy Model vs Modern LLM Probabilities */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Critical Distinction: Toy Unigram Model vs. Actual LLM Probabilities
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Understanding why university toy models differ fundamentally from deep foundation models like GPT-4, Gemini, and Claude.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Toy Model Card */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
                    Toy Unigram Language Model
                  </span>
                  <span className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                    Bag of Words
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900 block">Independence Assumption:</span>
                    <p className="text-slate-600">
                      Assumes each token occurs independently of previous words:{' '}
                      <code className="bg-amber-100 px-1 py-0.2 rounded font-mono">
                        P(w₁...wₘ) = ∏ P(wᵢ)
                      </code>
                      . It has <strong>zero context awareness</strong>.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Probability Derivation:</span>
                    <p className="text-slate-600">
                      Calculated from static frequency ratios over a small educational corpus with add-1 smoothing.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Computational Complexity:</span>
                    <p className="text-slate-600 font-mono">
                      O(1) hash map lookup.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modern LLM Card */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider font-mono">
                    Modern Autoregressive LLM
                  </span>
                  <span className="text-[10px] font-semibold bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded">
                    Transformer Attention
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900 block">Strict Context Conditioning:</span>
                    <p className="text-slate-600">
                      Computes the probability of token <code>wᵢ</code> conditioned on <em>all preceding tokens</em>:{' '}
                      <code className="bg-indigo-100 px-1 py-0.2 rounded font-mono">
                        P(wᵢ | w₁...wᵢ₋₁)
                      </code>
                      .
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Probability Derivation:</span>
                    <p className="text-slate-600">
                      Multi-layer Transformer with multi-head self-attention, generating continuous vector states normalized through a final <code>Softmax</code> over 100k+ vocabulary logits.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Computational Complexity:</span>
                    <p className="text-slate-600 font-mono">
                      Trillions of matrix operations (FLOPs) per prompt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
