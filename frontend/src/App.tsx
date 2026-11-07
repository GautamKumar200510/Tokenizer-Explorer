import React, { useState } from 'react';
import { Sidebar, TabId } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './pages/DashboardOverview';
import { Unit1Probability } from './pages/Unit1Probability';
import { Unit2TokenizerComparison } from './pages/Unit2TokenizerComparison';
import { Unit3BertGptSpeech } from './pages/Unit3BertGptSpeech';
import { Unit4ComparisonCharts } from './pages/Unit4ComparisonCharts';
import { Unit5FairnessAnalysis } from './pages/Unit5FairnessAnalysis';
import { AboutProject } from './pages/AboutProject';
import { MethodologyPage } from './pages/MethodologyPage';

const TAB_TITLES: Record<TabId, string> = {
  dashboard: 'Executive Dashboard & Quick Benchmark',
  u1_probability: 'U1 – Token Probability Explorer & Laplace LM',
  u2_tokenizers: 'U2 – BPE, WordPiece & SentencePiece Comparison',
  u3_speech: 'U3 – BERT vs GPT & Hindi Speech Transcription',
  u4_charts: 'U4 – Interactive Comparison Charts & Costs',
  u5_fairness: 'U5 – Language Cost Fairness & The Token Tax',
  about: 'About Project & Academic Specifications',
  methodology: 'NLP Methodology, Mathematics & Citations',
};

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onNavigate={setActiveTab} />;
      case 'u1_probability':
        return <Unit1Probability />;
      case 'u2_tokenizers':
        return <Unit2TokenizerComparison />;
      case 'u3_speech':
        return <Unit3BertGptSpeech />;
      case 'u4_charts':
        return <Unit4ComparisonCharts />;
      case 'u5_fairness':
        return <Unit5FairnessAnalysis />;
      case 'about':
        return <AboutProject />;
      case 'methodology':
        return <MethodologyPage />;
      default:
        return <DashboardOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activeTabTitle={TAB_TITLES[activeTab]}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
          <p>
            Tokenizer Explorer for Indian Languages • Generative AI CA Mini Project • English • Hindi • Marathi
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
