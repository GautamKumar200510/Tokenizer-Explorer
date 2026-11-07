import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import type { Language } from '../types';

export const OFFICIAL_SAMPLES: Record<Language, { text: string; label: string; translation: string }> = {
  english: {
    label: 'English (Official Sample)',
    text: 'Artificial intelligence can help students learn new concepts, practise problem-solving and access information more easily.',
    translation: 'Standard English benchmark for comparative baseline',
  },
  hindi: {
    label: 'Hindi / हिन्दी (Official Sample)',
    text: 'कृत्रिम बुद्धिमत्ता विद्यार्थियों को नई अवधारणाएँ सीखने, समस्या-समाधान का अभ्यास करने और जानकारी आसानी से प्राप्त करने में मदद कर सकती है।',
    translation: 'Direct semantic translation into Hindi in Devanagari script',
  },
  marathi: {
    label: 'Marathi / मराठी (Official Sample)',
    text: 'कृत्रिम बुद्धिमत्ता विद्यार्थ्यांना नवीन संकल्पना शिकण्यास, समस्या सोडवण्याचा सराव करण्यास आणि माहिती सहज मिळवण्यास मदत करू शकते।',
    translation: 'Direct semantic translation into Marathi with distinct case markers & verb suffixes',
  },
};

interface SampleTextSelectorProps {
  onSelectSample: (text: string, language: Language) => void;
  selectedLanguage?: Language;
}

export const SampleTextSelector: React.FC<SampleTextSelectorProps> = ({
  onSelectSample,
  selectedLanguage = 'hindi',
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            University Benchmark Parallel Samples
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Click to load semantically equivalent text</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {(Object.keys(OFFICIAL_SAMPLES) as Language[]).map((lang) => {
          const sample = OFFICIAL_SAMPLES[lang];
          const isSelected = selectedLanguage === lang;

          return (
            <button
              key={lang}
              type="button"
              onClick={() => onSelectSample(sample.text, lang)}
              className={`p-3 text-left rounded-lg border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500/20'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${isSelected ? 'text-indigo-800' : 'text-slate-800'}`}>
                  {sample.label}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  {lang}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 font-serif leading-relaxed">
                "{sample.text}"
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
