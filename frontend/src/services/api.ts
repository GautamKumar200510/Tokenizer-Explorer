import axios from 'axios';
import type {
  Language,
  CompareAllResponse,
  ProbabilityAnalysisResponse,
  BertVsGptResponse,
  TranscriptionResponse,
  AudioSample,
  ComparisonChartDataResponse,
  FairnessAnalysisResponse,
  SystemHealth
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  // System Health
  getHealth: async (): Promise<SystemHealth> => {
    const { data } = await api.get<SystemHealth>('/health');
    return data;
  },

  // U1: Token Probability
  analyzeProbability: async (text: string, language: Language): Promise<ProbabilityAnalysisResponse> => {
    const { data } = await api.post<ProbabilityAnalysisResponse>('/probability/analyze', {
      text,
      language,
    });
    return data;
  },

  getCorpusInfo: async (language: Language) => {
    const { data } = await api.get('/probability/corpus-info', {
      params: { language },
    });
    return data;
  },

  // U2: Tokenizer Comparison
  compareTokenizers: async (text: string, addSpecialTokens: boolean = false): Promise<CompareAllResponse> => {
    const { data } = await api.post<CompareAllResponse>('/tokenizers/compare', {
      text,
      add_special_tokens: addSpecialTokens,
    });
    return data;
  },

  explainDifferences: async (text: string) => {
    const { data } = await api.post('/explain/tokenizer-differences', { text });
    return data;
  },

  // U3: BERT vs GPT
  compareBertVsGpt: async (text: string, gptEncoding: string = 'cl100k'): Promise<BertVsGptResponse> => {
    const { data } = await api.post<BertVsGptResponse>('/bert-vs-gpt/compare', {
      text,
      gpt_encoding: gptEncoding,
    });
    return data;
  },

  // U3: Speech & Audio
  getAudioSamples: async (): Promise<AudioSample[]> => {
    const { data } = await api.get<{ samples: AudioSample[] }>('/speech/samples');
    return data.samples;
  },

  transcribeAudio: async (audioFile: File): Promise<TranscriptionResponse> => {
    const formData = new FormData();
    formData.append('file', audioFile);

    const { data } = await api.post<TranscriptionResponse>('/speech/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // U4: Charts & Cost Analysis
  getChartData: async (
    customTexts?: { english?: string; hindi?: string; marathi?: string },
    pricePerMillion: number = 2.50,
    requestsVolume: number = 10000
  ): Promise<ComparisonChartDataResponse> => {
    const { data } = await api.post<ComparisonChartDataResponse>('/comparisons/chart-data', {
      custom_texts: customTexts,
      price_per_million: pricePerMillion,
      requests_volume: requestsVolume,
    });
    return data;
  },

  exportCsvUrl: (
    pricePerMillion: number = 2.50,
    requestsVolume: number = 10000,
    customTexts?: { english?: string; hindi?: string; marathi?: string }
  ) => {
    return '/api/comparisons/export-csv';
  },

  downloadCsv: async (
    customTexts?: { english?: string; hindi?: string; marathi?: string },
    pricePerMillion: number = 2.50,
    requestsVolume: number = 10000
  ) => {
    const response = await api.post(
      '/comparisons/export-csv',
      {
        custom_texts: customTexts,
        price_per_million: pricePerMillion,
        requests_volume: requestsVolume,
      },
      { responseType: 'blob' }
    );
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tokenizer_comparison_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  getRecentHistory: async () => {
    const { data } = await api.get('/comparisons/history');
    return data.history;
  },

  // U5: Fairness Analysis
  getFairnessAnalysis: async (
    customTexts?: { english?: string; hindi?: string; marathi?: string },
    pricePerMillion: number = 2.50,
    contextWindow: number = 128000
  ): Promise<FairnessAnalysisResponse> => {
    const { data } = await api.post<FairnessAnalysisResponse>('/fairness/analyze', {
      custom_texts: customTexts,
      price_per_million: pricePerMillion,
      context_window_size: contextWindow,
    });
    return data;
  },

  getGeminiFairnessReport: async (
    customTexts?: { english?: string; hindi?: string; marathi?: string },
    pricePerMillion: number = 2.50
  ) => {
    const { data } = await api.post('/fairness/gemini-analysis', {
      custom_texts: customTexts,
      price_per_million: pricePerMillion,
    });
    return data;
  },
};
