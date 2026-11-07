import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  RotateCcw,
  BookOpen,
  Info,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SampleTextSelector, OFFICIAL_SAMPLES } from '../components/SampleTextSelector';
import { TokenBadge } from '../components/TokenBadge';
import { apiClient } from '../services/api';
import type { CompareAllResponse, Language } from '../types';

export const Unit2TokenizerComparison: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('hindi');
  const [inputText, setInputText] = useState(OFFICIAL_SAMPLES.hindi.text);
  const [comparison, setComparison] = useState<CompareAllResponse | null>(null);
  const [geminiExplanation, setGeminiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModelTab, setActiveModelTab] = useState<string>('all');
  const [expandedTokens, setExpandedTokens] = useState<Record<string, boolean>>({});

  const runComparison = async (textToRun: string) => {
    if (!textToRun.trim()) return;
    try {
      setIsLoading(true);
      setGeminiExplanation(null);
      const res = await apiClient.compareTokenizers(textToRun);
      setComparison(res);
    } catch (err) {
      console.error('Tokenizer comparison failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runComparison(inputText);
  }, []);

  const handleSelectSample = (sampleText: string, lang: Language) => {
    setSelectedLanguage(lang);
    setInputText(sampleText);
    runComparison(sampleText);
  };

  const handleExplainWithGemini = async () => {
    if (!comparison) return;
    try {
      setIsExplaining(true);
      const res = await apiClient.explainDifferences(inputText);
      setGeminiExplanation(res.explanation?.explanation_markdown || 'No explanation available');
    } catch (err) {
      console.error('Gemini explanation error:', err);
    } finally {
      setIsExplaining(false);
    }
  };

  const toggleExpand = (modelId: string) => {
    setExpandedTokens((prev) => ({
      ...prev,
      [modelId]: !prev[modelId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
                UNIT 2
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                BPE, WordPiece & SentencePiece Comparison
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Benchmark real tokenizer implementations: GPT-2 (Byte-level BPE), Multilingual BERT (WordPiece), and XLM-RoBERTa (SentencePiece).
            </p>
          </div>

          <button
            type="button"
            onClick={handleExplainWithGemini}
            disabled={isExplaining || !comparison}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2 self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isExplaining ? 'Analyzing with Gemini...' : 'Explain Differences with AI'}
          </button>
        </div>

        {/* Input box */}
        <div className="mt-4 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Input Sentence to Compare:
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3.5 border border-slate-300 rounded-xl text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-xs leading-relaxed"
            placeholder="Type or paste text in English, Hindi, or Marathi..."
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {inputText.length} characters • {inputText.split(/\s+/).filter(Boolean).length} words
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const defaultText = OFFICIAL_SAMPLES[selectedLanguage].text;
                  setInputText(defaultText);
                  runComparison(defaultText);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Sample
              </button>
              <button
                type="button"
                onClick={() => runComparison(inputText)}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                {isLoading ? 'Tokenizing with Real Models...' : 'Run Tokenizer Comparison'}
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

      {/* AI Explanation Banner */}
      {geminiExplanation && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 border border-purple-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Gemini AI Explanation of Tokenizer Differences
            </h3>
            <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
              Linguistic Analysis
            </span>
          </div>
          <div className="prose prose-sm max-w-none text-slate-700 font-sans leading-relaxed whitespace-pre-wrap">
            {geminiExplanation}
          </div>
        </div>
      )}

      {/* Side-by-Side Tokenizer Comparison Cards */}
      {comparison && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Side-by-Side Actual Tokenizer Outputs
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Hover over any token to inspect its raw token, byte length, and boundary
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. GPT-2 (Byte-Level BPE) */}
            {(() => {
              const model = comparison.tokenizers.gpt2;
              const isExpanded = expandedTokens['gpt2'];
              const visibleTokens = isExpanded ? model.tokens : model.tokens.slice(0, 30);

              return (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                          BPE Algorithm
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {model.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold font-mono text-slate-900 block">
                          {model.token_count}
                        </span>
                        <span className="text-[10px] text-slate-400">total tokens</span>
                      </div>
                    </div>

                    <div className="my-2 text-[11px] text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Vocab Size:</span>
                        <span className="font-mono font-semibold text-slate-700">{model.vocab_size.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Boundary Convention:</span>
                        <span className="font-mono text-indigo-600 font-semibold">{model.boundary_marker}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compression Ratio:</span>
                        <span className="font-mono font-semibold text-slate-700">{model.token_to_word_ratio} tok/word</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 min-h-[140px] flex flex-wrap gap-1 content-start">
                      {visibleTokens.map((t) => (
                        <TokenBadge key={t.index} token={t} variant="bpe" />
                      ))}
                    </div>
                  </div>

                  {model.tokens.length > 30 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand('gpt2')}
                      className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
                      ) : (
                        <>View all {model.tokens.length} tokens <ChevronDown className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* 2. mBERT (WordPiece) */}
            {(() => {
              const model = comparison.tokenizers.bert_multilingual;
              const isExpanded = expandedTokens['bert_multilingual'];
              const visibleTokens = isExpanded ? model.tokens : model.tokens.slice(0, 30);

              return (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">
                          WordPiece Algorithm
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {model.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold font-mono text-slate-900 block">
                          {model.token_count}
                        </span>
                        <span className="text-[10px] text-slate-400">total tokens</span>
                      </div>
                    </div>

                    <div className="my-2 text-[11px] text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Vocab Size:</span>
                        <span className="font-mono font-semibold text-slate-700">{model.vocab_size.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Boundary Convention:</span>
                        <span className="font-mono text-purple-600 font-semibold">{model.boundary_marker}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compression Ratio:</span>
                        <span className="font-mono font-semibold text-slate-700">{model.token_to_word_ratio} tok/word</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 min-h-[140px] flex flex-wrap gap-1 content-start">
                      {visibleTokens.map((t) => (
                        <TokenBadge key={t.index} token={t} variant="wordpiece" />
                      ))}
                    </div>
                  </div>

                  {model.tokens.length > 30 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand('bert_multilingual')}
                      className="text-xs text-purple-600 font-semibold hover:text-purple-800 flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
                      ) : (
                        <>View all {model.tokens.length} tokens <ChevronDown className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* 3. XLM-RoBERTa (SentencePiece) */}
            {(() => {
              const model = comparison.tokenizers.xlm_roberta;
              const isExpanded = expandedTokens['xlm_roberta'];
              const visibleTokens = isExpanded ? model.tokens : model.tokens.slice(0, 30);

              return (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          SentencePiece Algorithm
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {model.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold font-mono text-emerald-700 block">
                          {model.token_count}
                        </span>
                        <span className="text-[10px] text-slate-400">total tokens</span>
                      </div>
                    </div>

                    <div className="my-2 text-[11px] text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Vocab Size:</span>
                        <span className="font-mono font-semibold text-slate-700">{model.vocab_size.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Boundary Convention:</span>
                        <span className="font-mono text-emerald-600 font-semibold">{model.boundary_marker}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compression Ratio:</span>
                        <span className="font-mono font-semibold text-slate-700">{model.token_to_word_ratio} tok/word</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 min-h-[140px] flex flex-wrap gap-1 content-start">
                      {visibleTokens.map((t) => (
                        <TokenBadge key={t.index} token={t} variant="sentencepiece" />
                      ))}
                    </div>
                  </div>

                  {model.tokens.length > 30 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand('xlm_roberta')}
                      className="text-xs text-emerald-600 font-semibold hover:text-emerald-800 flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
                      ) : (
                        <>View all {model.tokens.length} tokens <ChevronDown className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Also show Modern Tiktoken cl100k and o200k in expandable strip */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Bonus Modern GPT Encodings (OpenAI Tiktoken):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-900">
                    GPT-4 / ChatGPT (cl100k_base): {comparison.tokenizers.tiktoken_cl100k.token_count} tokens
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">100k Vocab</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {comparison.tokenizers.tiktoken_cl100k.tokens.slice(0, 15).map((t) => (
                    <TokenBadge key={t.index} token={t} />
                  ))}
                  {comparison.tokenizers.tiktoken_cl100k.tokens.length > 15 && (
                    <span className="text-xs text-slate-400 self-center font-mono">
                      +{comparison.tokenizers.tiktoken_cl100k.tokens.length - 15} more...
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-purple-900">
                    GPT-4o (o200k_base): {comparison.tokenizers.tiktoken_o200k.token_count} tokens
                  </span>
                  <span className="text-[10px] font-mono text-purple-600 font-semibold">200k Multilingual Vocab</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {comparison.tokenizers.tiktoken_o200k.tokens.slice(0, 15).map((t) => (
                    <TokenBadge key={t.index} token={t} />
                  ))}
                  {comparison.tokenizers.tiktoken_o200k.tokens.length > 15 && (
                    <span className="text-xs text-purple-400 self-center font-mono">
                      +{comparison.tokenizers.tiktoken_o200k.tokens.length - 15} more...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
