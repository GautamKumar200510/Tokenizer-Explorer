import React from 'react';
import {
  LayoutDashboard,
  Dice5,
  Layers,
  Mic2,
  BarChart3,
  Scale,
  Info,
  BookOpen,
  Globe2,
  X,
  ExternalLink,
} from 'lucide-react';

export type TabId =
  | 'dashboard'
  | 'u1_probability'
  | 'u2_tokenizers'
  | 'u3_speech'
  | 'u4_charts'
  | 'u5_fairness'
  | 'about'
  | 'methodology';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS: Array<{
  id: TabId;
  label: string;
  badge?: string;
  icon: React.ReactNode;
  category?: string;
}> = [
  {
    id: 'dashboard',
    label: 'Dashboard Overview',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: 'u1_probability',
    label: 'U1 – Token Probability',
    badge: 'Laplace LM',
    icon: <Dice5 className="w-4 h-4" />,
    category: 'University Units',
  },
  {
    id: 'u2_tokenizers',
    label: 'U2 – BPE, WordPiece, SP',
    badge: 'Real Models',
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: 'u3_speech',
    label: 'U3 – BERT vs GPT & Speech',
    badge: 'Whisper',
    icon: <Mic2 className="w-4 h-4" />,
  },
  {
    id: 'u4_charts',
    label: 'U4 – Comparison Charts',
    badge: 'Recharts',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 'u5_fairness',
    label: 'U5 – Language Cost Fairness',
    badge: 'Token Tax',
    icon: <Scale className="w-4 h-4" />,
  },
  {
    id: 'about',
    label: 'About Project',
    icon: <Info className="w-4 h-4" />,
    category: 'Documentation',
  },
  {
    id: 'methodology',
    label: 'Methodology & References',
    icon: <BookOpen className="w-4 h-4" />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0a0f1d] text-slate-200 border-r border-slate-800/80 z-50 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <Globe2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight text-white block uppercase">
                P20 Explorer
              </span>
              <span className="text-[10px] text-indigo-400 font-mono tracking-tight block">
                Indian Languages NLP
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <React.Fragment key={item.id}>
                {item.category && (
                  <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    {item.category}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-purple-300 border border-purple-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer info card */}
        <div className="p-3 border-t border-slate-800 bg-[#070b14]">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
            <div className="flex justify-between items-center text-slate-400 font-semibold">
              <span>Benchmark Corpora</span>
              <span className="text-emerald-400 font-mono">EN • HI • MR</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Comparing Byte-level BPE, WordPiece, and SentencePiece on Devanagari Unicode.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
