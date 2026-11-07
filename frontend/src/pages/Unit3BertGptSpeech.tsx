import React, { useState, useEffect } from 'react';
import {
  Mic2,
  Sparkles,
  RotateCcw,
  Volume2,
  Layers,
  ArrowRight,
  TrendingDown,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { AudioRecorder } from '../components/AudioRecorder';
import { TokenBadge } from '../components/TokenBadge';
import { StatCard } from '../components/StatCard';
import { apiClient } from '../services/api';
import type { BertVsGptResponse } from '../types';

export const Unit3BertGptSpeech: React.FC = () => {
  const [inputText, setInputText] = useState(
    'कृत्रिम बुद्धिमत्ता विद्यार्थियों को नई अवधारणाएँ सीखने में मदद करती है।'
  );
  const [selectedGptEncoding, setSelectedGptEncoding] = useState<'cl100k' | 'o200k' | 'gpt2'>('cl100k');
  const [comparison, setComparison] = useState<BertVsGptResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);

  const runBertGptComparison = async (text: string, encoding: string) => {
    if (!text.trim()) return;
    try {
      setIsLoading(true);
      const res = await apiClient.compareBertVsGpt(text, encoding);
      setComparison(res);
    } catch (err) {
      console.error('BERT vs GPT comparison error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runBertGptComparison(inputText, selectedGptEncoding);
  }, [selectedGptEncoding]);

  const handleTranscriptReady = (transcript: string) => {
    setTranscribedText(transcript);
    setInputText(transcript);
    runBertGptComparison(transcript, selectedGptEncoding);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                UNIT 3
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                BERT vs GPT Tokenizer & Hindi Speech
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Directly contrast real WordPiece (mBERT) against OpenAI Tiktoken encodings, combined with Whisper Hindi speech-to-text transcription.
            </p>
          </div>

          {/* GPT Encoding Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2">GPT Encoding:</span>
            {[
              { id: 'cl100k', label: 'cl100k (GPT-4)' },
              { id: 'o200k', label: 'o200k (GPT-4o)' },
              { id: 'gpt2', label: 'gpt2 (Legacy)' },
            ].map((enc) => (
              <button
                key={enc.id}
                type="button"
                onClick={() => setSelectedGptEncoding(enc.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedGptEncoding === enc.id
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {enc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input area */}
        <div className="mt-4 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Sentence Under Comparison (or dictate below via speech):
          </label>
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3.5 border border-slate-300 rounded-xl text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs leading-relaxed"
            placeholder="Type Hindi or English text here or use speech input below..."
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              {inputText.length} chars • {inputText.split(/\s+/).filter(Boolean).length} words
            </span>

            <button
              type="button"
              onClick={() => runBertGptComparison(inputText, selectedGptEncoding)}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4" />
              {isLoading ? 'Tokenizing...' : 'Tokenize in BERT & GPT'}
            </button>
          </div>
        </div>
      </div>

      {/* Audio Recorder & Speech Component */}
      <AudioRecorder onTranscriptReady={handleTranscriptReady} />

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              title="BERT Token Count"
              value={comparison.summary.bert_token_count}
              subtitle="WordPiece (119k vocab)"
              badge="mBERT"
              badgeColor="purple"
            />
            <StatCard
              title="GPT Token Count"
              value={comparison.summary.gpt_token_count}
              subtitle={comparison.summary.gpt_selected_encoding}
              badge={comparison.summary.gpt_encoding_id}
              badgeColor="blue"
            />
            <StatCard
              title="Token Difference"
              value={`${comparison.summary.token_difference > 0 ? '+' : ''}${comparison.summary.token_difference}`}
              subtitle="GPT tokens minus BERT tokens"
              badge={comparison.summary.token_difference <= 0 ? 'GPT More Compact' : 'BERT More Compact'}
              badgeColor={comparison.summary.token_difference <= 0 ? 'emerald' : 'amber'}
            />
            <StatCard
              title="More Compact Tokenizer"
              value={comparison.summary.more_compact_model}
              subtitle="Fewer tokens for equivalent text"
              badge="Winner"
              badgeColor="emerald"
            />
          </div>

          {/* Side by side token ID and piece visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BERT Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">
                    Multilingual BERT
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    bert-base-multilingual-cased
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-purple-700">
                    {comparison.bert.token_count} tokens
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex justify-between">
                <span>Boundary Marker: <code className="text-purple-600 font-bold font-mono">##</code></span>
                <span>Vocab: <strong className="text-slate-700 font-mono">119,547</strong></span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[140px] flex flex-wrap gap-1 content-start">
                {comparison.bert.tokens.map((t) => (
                  <TokenBadge key={t.index} token={t} variant="wordpiece" />
                ))}
              </div>

              {/* Token IDs list */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Extracted Token IDs:
                </span>
                <div className="p-2 bg-slate-900 text-purple-200 rounded text-[11px] font-mono overflow-x-auto whitespace-nowrap">
                  [{comparison.bert.tokens.map((t) => t.id).join(', ')}]
                </div>
              </div>
            </div>

            {/* GPT Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                    OpenAI Tiktoken
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {comparison.gpt.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-blue-700">
                    {comparison.gpt.token_count} tokens
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex justify-between">
                <span>Encoding: <code className="text-blue-600 font-bold font-mono">{comparison.summary.gpt_encoding_id}</code></span>
                <span>Vocab: <strong className="text-slate-700 font-mono">{comparison.gpt.vocab_size.toLocaleString()}</strong></span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[140px] flex flex-wrap gap-1 content-start">
                {comparison.gpt.tokens.map((t) => (
                  <TokenBadge key={t.index} token={t} variant="bpe" />
                ))}
              </div>

              {/* Token IDs list */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Extracted Token IDs:
                </span>
                <div className="p-2 bg-slate-900 text-blue-200 rounded text-[11px] font-mono overflow-x-auto whitespace-nowrap">
                  [{comparison.gpt.tokens.map((t) => t.id).join(', ')}]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
