export type Language = 'english' | 'hindi' | 'marathi';

export interface TokenItem {
  index: number;
  id: number;
  raw_token: string;
  decoded_piece: string;
  is_word_start: boolean;
  is_subword_continuation: boolean;
  char_length: number;
  byte_length: number;
}

export interface TokenizerResult {
  tokenizer_id: string;
  name: string;
  algorithm: string;
  vocab_size: number;
  boundary_marker: string;
  family: string;
  description: string;
  indic_efficiency: string;
  token_count: number;
  word_count: number;
  char_count: number;
  byte_count: number;
  token_to_word_ratio: number;
  characters_per_token: number;
  bytes_per_token: number;
  tokens: TokenItem[];
}

export interface CompareAllResponse {
  input_text: string;
  char_count: number;
  word_count: number;
  tokenizers: {
    gpt2: TokenizerResult;
    bert_multilingual: TokenizerResult;
    xlm_roberta: TokenizerResult;
    tiktoken_cl100k: TokenizerResult;
    tiktoken_o200k: TokenizerResult;
  };
}

export interface SingleTokenProbability {
  token: string;
  raw_count: number;
  numerator: number;
  denominator: number;
  probability: number;
  probability_formatted: string;
  surprisal_bits: number;
  nll: number;
  is_oov: boolean;
  formula_string: string;
  corpus_stats: {
    total_tokens_N: number;
    vocab_size_V: number;
  };
  index?: number;
}

export interface ProbabilityAnalysisResponse {
  language: string;
  input_text: string;
  tokens: SingleTokenProbability[];
  total_tokens: number;
  vocabulary_size_V: number;
  corpus_token_count_N: number;
  sequence_log_likelihood: number;
  cross_entropy_bits_per_token: number;
  perplexity: number;
  smoothing_formula: {
    name: string;
    latex: string;
    description: string;
    perplexity_formula: string;
  };
  toy_vs_llm_comparison: {
    toy_model: {
      architecture: string;
      context_handling: string;
      probability_source: string;
      vocabulary: string;
      computational_cost: string;
    };
    modern_llm: {
      architecture: string;
      context_handling: string;
      probability_source: string;
      vocabulary: string;
      computational_cost: string;
    };
  };
}

export interface BertVsGptResponse {
  input_text: string;
  summary: {
    bert_token_count: number;
    gpt_token_count: number;
    token_difference: number;
    more_compact_model: string;
    gpt_selected_encoding: string;
    gpt_encoding_id: string;
    bert_model_id: string;
  };
  bert: TokenizerResult;
  gpt: TokenizerResult;
  architectural_contrast: {
    bert: {
      model: string;
      algorithm: string;
      vocabulary_size: number;
      boundary_convention: string;
      design_philosophy: string;
    };
    gpt: {
      model: string;
      algorithm: string;
      vocabulary_size: number;
      boundary_convention: string;
      design_philosophy: string;
    };
  };
}

export interface AudioSample {
  id: string;
  title: string;
  filename: string;
  duration: string;
  topic: string;
  word_count: number;
  transcript_preview: string;
  full_transcript: string;
  audio_url: string;
}

export interface TranscriptionResponse {
  transcript: string;
  engine: string;
  is_live_api: boolean;
  filename: string;
  status: string;
  note?: string;
  error?: string;
  detected_language?: string;
  quick_tokens?: {
    gpt_tokens: number;
    bert_tokens: number;
    word_count: number;
  };
}

export interface ChartItem {
  tokenizerId: string;
  tokenizerName: string;
  family: string;
  English: number;
  Hindi: number;
  Marathi: number;
  hindiMultiplier: number;
  marathiMultiplier: number;
}

export interface CostChartItem {
  tokenizerId: string;
  tokenizerName: string;
  family: string;
  EnglishCost: number;
  HindiCost: number;
  MarathiCost: number;
  costDisparityHindi: string;
  costDisparityMarathi: string;
}

export interface ComparisonTableRow {
  language: string;
  tokenizer: string;
  algorithm: string;
  family: string;
  tokenCount: number;
  wordCount: number;
  charCount: number;
  tokenToWordRatio: number;
  charsPerToken: number;
  costForVolume: number;
  multiplierVsEnglish: number;
}

export interface ComparisonChartDataResponse {
  pricing_per_million: number;
  requests_volume: number;
  texts: {
    english: string;
    hindi: string;
    marathi: string;
  };
  token_comparison_chart: ChartItem[];
  cost_comparison_chart: CostChartItem[];
  table_rows: ComparisonTableRow[];
}

export interface FairnessModelBreakdown {
  modelKey: string;
  modelName: string;
  english: {
    tokens: number;
    words: number;
    tokenToWordRatio: number;
    costPerMillionCalls: number;
    wordsInContextWindow: number;
  };
  hindi: {
    tokens: number;
    words: number;
    tokenToWordRatio: number;
    tokenTaxMultiplier: number;
    costPerMillionCalls: number;
    wordsInContextWindow: number;
    contextShrinkagePct: number;
  };
  marathi: {
    tokens: number;
    words: number;
    tokenToWordRatio: number;
    tokenTaxMultiplier: number;
    costPerMillionCalls: number;
    wordsInContextWindow: number;
    contextShrinkagePct: number;
  };
}

export interface FairnessAnalysisResponse {
  context_window_size: number;
  price_per_million: number;
  sample_texts: {
    english: string;
    hindi: string;
    marathi: string;
  };
  models_breakdown: FairnessModelBreakdown[];
  key_takeaways: {
    token_tax_hindi_gpt4: string;
    token_tax_marathi_gpt4: string;
    gpt4o_improvement_hindi: string;
    context_window_penalty_hindi: string;
    context_window_penalty_marathi: string;
  };
  linguistic_reasons: Array<{
    factor: string;
    explanation: string;
  }>;
  engineering_recommendations: string[];
}

export interface SystemHealth {
  status: string;
  project: string;
  version: string;
  api_keys: {
    gemini_configured: boolean;
    openai_whisper_configured: boolean;
  };
  default_samples: {
    english: string;
    hindi: string;
    marathi: string;
  };
}
