import React, { useState } from 'react';
import type { TokenItem } from '../types';

interface TokenBadgeProps {
  token: TokenItem;
  variant?: 'bpe' | 'wordpiece' | 'sentencepiece' | 'unigram' | 'default';
  showId?: boolean;
}

// Consistent cycling pastel palette for tokens
const COLOR_CLASSES = [
  'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
  'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
];

export const TokenBadge: React.FC<TokenBadgeProps> = ({
  token,
  variant = 'default',
  showId = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const colorClass = COLOR_CLASSES[token.index % COLOR_CLASSES.length];

  // Visual formatting for boundary markers
  let displayString = token.decoded_piece;
  if (displayString === ' ') {
    displayString = '␣';
  } else if (displayString.startsWith(' ')) {
    displayString = ' ' + displayString.trim();
  }

  return (
    <div
      className="relative inline-block m-1 select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`token-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium border shadow-xs cursor-pointer ${colorClass}`}
      >
        <span className="font-mono font-semibold tracking-wide text-xs opacity-60">
          #{token.index + 1}
        </span>
        <span className="font-sans text-sm font-semibold whitespace-pre">
          {displayString || token.raw_token}
        </span>
        {showId && (
          <span className="font-mono text-[11px] px-1 py-0.2 rounded bg-white/70 border border-black/5 opacity-80">
            {token.id}
          </span>
        )}
      </div>

      {/* Floating detail tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none transition-all duration-150">
          <div className="font-semibold text-slate-200 pb-1 border-b border-slate-700 flex justify-between items-center">
            <span>Token #{token.index + 1} Details</span>
            <span className="text-[10px] bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">
              ID: {token.id}
            </span>
          </div>
          <div className="mt-1.5 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Decoded Text:</span>
              <span className="text-emerald-400 font-sans font-semibold">
                "{token.decoded_piece}"
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Raw Token:</span>
              <span className="text-amber-300">{token.raw_token}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Length:</span>
              <span className="text-slate-300">
                {token.char_length} chars / {token.byte_length} bytes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Boundary:</span>
              <span className="text-cyan-300">
                {token.is_word_start ? 'Word Start' : 'Subword Continuation'}
              </span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
