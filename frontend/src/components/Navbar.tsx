import React, { useEffect, useState } from 'react';
import { Sparkles, Cpu, Activity, ShieldCheck, Terminal, Menu } from 'lucide-react';
import { apiClient } from '../services/api';
import type { SystemHealth } from '../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeTabTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, activeTabTitle }) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    apiClient.getHealth()
      .then(setHealth)
      .catch((err) => console.warn('Health check unreachable:', err));
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {activeTabTitle}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            P20 • Tokenizer Explorer for Indian Languages (English, Hindi, Marathi)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Real Tokenizers Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Cpu className="w-3.5 h-3.5" />
          <span>HuggingFace & Tiktoken (Live)</span>
        </div>

        {/* Gemini API Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
            health?.api_keys.gemini_configured
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
          title={
            health?.api_keys.gemini_configured
              ? 'Google Gemini API is configured for live analysis'
              : 'Deterministic expert NLP fallback active (Set GEMINI_API_KEY in .env)'
          }
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Gemini AI: {health?.api_keys.gemini_configured ? 'Active' : 'Offline Mode'}</span>
        </div>

        {/* Whisper API Badge */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
            health?.api_keys.openai_whisper_configured
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
          title={
            health?.api_keys.openai_whisper_configured
              ? 'OpenAI Whisper API active for Hindi speech'
              : 'Acoustic Benchmarks active (Set OPENAI_API_KEY in .env)'
          }
        >
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span>Whisper: {health?.api_keys.openai_whisper_configured ? 'API Live' : 'Benchmark'}</span>
        </div>

        {/* Version Badge */}
        <span className="font-mono text-[10px] bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-800">
          v1.0.0
        </span>
      </div>
    </header>
  );
};
