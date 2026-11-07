import React from 'react';
import { BookOpen, Sparkles, Code2, Layers, CheckCircle2, Bookmark } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
            METHODOLOGY & THEORY
          </span>
          <span className="text-xs font-mono text-slate-500">NLP Engineering Specifications</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Tokenizer Algorithms & Mathematical Formulations
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Comprehensive reference on the mathematical principles governing subword segmentation,
          Laplace smoothing, Devanagari Unicode dynamics, and academic literature.
        </p>
      </div>

      {/* Section 1: Laplace Smoothing Mathematics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          1. Laplace (Add-1) Smoothing Formulation (Unit 1)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          In Maximum Likelihood Estimation (MLE), any word <code>w</code> not observed in the training corpus receives a probability of zero:
          <code> P_{"{MLE}"}(w) = C(w) / N = 0</code>. In a sequence calculation, a single zero probability forces the sequence probability to zero.
        </p>

        <div className="p-4 bg-slate-900 text-indigo-200 rounded-xl font-mono text-xs overflow-x-auto space-y-2">
          <div className="text-amber-400 font-bold">// Add-1 Laplace Smoothing Equation:</div>
          <div>P_Laplace(w) = (Count(w) + 1) / (N + V)</div>
          <div className="text-slate-400">// Where:</div>
          <div>C(w) = Raw frequency of token w in sample corpus</div>
          <div>N = Total number of tokens in corpus (∑ C(w))</div>
          <div>V = Vocabulary size (distinct unique words in corpus)</div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
          <span className="font-bold text-slate-900 block">Surprisal and Perplexity:</span>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li><strong>Information Content (Surprisal):</strong> <code>I(w) = -log₂(P(w))</code> (measured in bits). Rarer words convey higher information.</li>
            <li><strong>Sequence Log-Likelihood:</strong> <code>LL(W) = ∑ ln P(wᵢ)</code></li>
            <li><strong>Sentence Perplexity:</strong> <code>PP(W) = 2^{"{- (1/m) ∑ log₂ P(wᵢ)}"}</code> — measures the branching factor or uncertainty of the model on the sentence.</li>
          </ul>
        </div>
      </div>

      {/* Section 2: Subword Tokenization Algorithms Compared */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600" />
          2. Algorithmic Comparison: BPE vs WordPiece vs SentencePiece
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* BPE */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
            <span className="text-xs font-bold text-blue-800 uppercase font-mono block">
              Byte-Pair Encoding (BPE)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Iteratively merges the most frequent pair of adjacent bytes or characters in the corpus until the target vocabulary size is reached.
            </p>
            <div className="text-[11px] text-slate-500 font-mono space-y-1 pt-2 border-t border-blue-100">
              <div>Boundary: <code>Ġ</code> (GPT-2)</div>
              <div>Selection: Raw Frequency</div>
              <div>Paper: Sennrich et al. (2016)</div>
            </div>
          </div>

          {/* WordPiece */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
            <span className="text-xs font-bold text-purple-800 uppercase font-mono block">
              WordPiece (BERT)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Similar to BPE, but chooses the merge pair that maximizes the likelihood of the language model over the training data, rather than pure frequency.
            </p>
            <div className="text-[11px] text-slate-500 font-mono space-y-1 pt-2 border-t border-purple-100">
              <div>Boundary: <code>##</code> (prefix)</div>
              <div>Selection: Likelihood Ratio</div>
              <div>Paper: Schuster & Nakajima (2012)</div>
            </div>
          </div>

          {/* SentencePiece */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase font-mono block">
              SentencePiece (XLM-R / T5)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Treats the input sentence as a continuous stream of characters with whitespace encoded as <code> </code> (U+2581). Unigram model prunes vocabulary by EM loss.
            </p>
            <div className="text-[11px] text-slate-500 font-mono space-y-1 pt-2 border-t border-emerald-100">
              <div>Boundary: <code> </code> (U+2581)</div>
              <div>Selection: Loss-minimization</div>
              <div>Paper: Kudo & Richardson (2018)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Devanagari Script & Unicode Mechanics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          3. Devanagari Script Structure & The "Token Tax"
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Devanagari is an <strong>abugida</strong> writing system where each consonant symbol inherently carries an inherent vowel <em>/a/</em>.
          When vowels follow consonants, they are written as dependent diacritics known as <strong>matras</strong> (e.g. <code>क + ृ = कृ</code>).
          When consonants cluster, a <strong>virama/halant (्)</strong> suppresses the vowel, forming complex conjuncts (e.g. <code>द + ् + ध = द्ध</code>).
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <span className="font-bold text-slate-900 block">UTF-8 Byte Structure:</span>
          <p className="text-slate-600">
            Standard English ASCII letters (<code>A-Z, a-z</code>) require exactly <strong>1 byte</strong> per character (0x00 to 0x7F).
            Devanagari characters fall in the Unicode block <code>U+0900 to U+097F</code>, requiring <strong>3 bytes</strong> in UTF-8 (e.g. <code>क = 0xE0 0xA4 0x95</code>).
            When a tokenizer lacks the character in its vocabulary, byte-level fallback splits each character into 3 distinct tokens!
          </p>
        </div>
      </div>

      {/* Section 4: Academic Citations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-500" />
          Key Academic Citations & Literature
        </h3>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong>Petrov et al. (2023)</strong>: <em>"Language Model Tokenizers Introduce Significant Disparities Across Languages"</em> — First formal quantification of the "Language Token Tax" in commercial foundation models.
          </li>
          <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong>Sennrich, Haddow, & Birch (2016)</strong>: <em>"Neural Machine Translation of Rare Words with Subword Units"</em> (ACL 2016) — Introduced Byte-Pair Encoding to natural language processing.
          </li>
          <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong>Kudo (2018)</strong>: <em>"Subword Regularization: Improving Neural Network Translation Models with Multiple Subword Candidates"</em> (ACL 2018) — Proposed SentencePiece unigram language model.
          </li>
          <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong>Devlin et al. (2019)</strong>: <em>"BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding"</em> (NAACL 2019) — Established WordPiece for multilingual representation.
          </li>
        </ul>
      </div>
    </div>
  );
};
