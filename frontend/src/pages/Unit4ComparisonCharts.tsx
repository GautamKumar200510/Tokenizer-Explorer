import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  DollarSign,
  Download,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Table as TableIcon,
  Sliders,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SampleTextSelector, OFFICIAL_SAMPLES } from '../components/SampleTextSelector';
import { StatCard } from '../components/StatCard';
import { apiClient } from '../services/api';
import type { ComparisonChartDataResponse, Language } from '../types';

export const Unit4ComparisonCharts: React.FC = () => {
  const [pricingPerMillion, setPricingPerMillion] = useState<number>(2.50);
  const [requestsVolume, setRequestsVolume] = useState<number>(10000);
  const [chartData, setChartData] = useState<ComparisonChartDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchChartData = async (price: number, volume: number) => {
    try {
      setIsLoading(true);
      const res = await apiClient.getChartData(
        {
          english: OFFICIAL_SAMPLES.english.text,
          hindi: OFFICIAL_SAMPLES.hindi.text,
          marathi: OFFICIAL_SAMPLES.marathi.text,
        },
        price,
        volume
      );
      setChartData(res);
    } catch (err) {
      console.error('Failed to load chart data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData(pricingPerMillion, requestsVolume);
  }, []);

  const handleApplyPricing = () => {
    fetchChartData(pricingPerMillion, requestsVolume);
  };

  const handleDownloadCsv = async () => {
    try {
      setIsExporting(true);
      await apiClient.downloadCsv(undefined, pricingPerMillion, requestsVolume);
    } catch (err) {
      console.error('CSV export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                UNIT 4
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Interactive Comparison Charts & Cost Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Interactive visualizations generated dynamically from actual tokenizer measurements comparing English, Hindi, and Marathi.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={isExporting || !chartData}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2 self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Generating CSV...' : 'Export CSV Report'}
          </button>
        </div>

        {/* Pricing Controls Slider / Input */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Model Input Pricing ($ / 1M Tokens)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.10"
                min="0.10"
                max="50.00"
                value={pricingPerMillion}
                onChange={(e) => setPricingPerMillion(parseFloat(e.target.value) || 2.50)}
                className="w-28 p-2 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 bg-white"
              />
              <span className="text-xs text-slate-500">per million tokens</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Projected Request Volume
            </label>
            <select
              value={requestsVolume}
              onChange={(e) => setRequestsVolume(parseInt(e.target.value, 10))}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 bg-white"
            >
              <option value="1000">1,000 API Requests (Small App)</option>
              <option value="10000">10,000 API Requests (Standard Batch)</option>
              <option value="100000">100,000 API Requests (Enterprise Monthly)</option>
              <option value="1000000">1,000,000 API Requests (Scale Platform)</option>
            </select>
          </div>

          <div className="flex md:justify-end items-center">
            <button
              type="button"
              onClick={handleApplyPricing}
              disabled={isLoading}
              className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5" />
              {isLoading ? 'Updating Charts...' : 'Update Charts & Costs'}
            </button>
          </div>
        </div>
      </div>

      {chartData && (
        <div className="space-y-6">
          {/* Chart 1: Token Count Comparison Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Actual Token Count Comparison (Lower is Better)
                </h3>
                <p className="text-xs text-slate-500">
                  Total tokens required for semantically equivalent sentences across English, Hindi, and Marathi.
                </p>
              </div>
              <span className="text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded">
                Live Measured Metrics
              </span>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.token_comparison_chart}
                  margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="tokenizerName" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} label={{ value: 'Token Count', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="English" fill="#3b82f6" name="English (Baseline)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Hindi" fill="#f59e0b" name="Hindi (Devanagari)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Marathi" fill="#ec4899" name="Marathi (Devanagari)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Estimated API Cost Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Estimated API Cost for {requestsVolume.toLocaleString()} Invocations @ ${pricingPerMillion}/1M Tokens
                </h3>
                <p className="text-xs text-slate-500">
                  Financial impact of token inflation on production LLM API calls.
                </p>
              </div>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded">
                Cost Disparity
              </span>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.cost_comparison_chart}
                  margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="tokenizerName" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} label={{ value: 'Cost in USD ($)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: any) => [`$${Number(value).toFixed(4)}`, 'Estimated Cost']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="EnglishCost" fill="#2563eb" name="English Cost ($)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="HindiCost" fill="#d97706" name="Hindi Cost ($)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="MarathiCost" fill="#db2777" name="Marathi Cost ($)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-indigo-600" />
                  Comprehensive Tokenizer Benchmark Table
                </h3>
                <p className="text-xs text-slate-500">
                  Granular measurements across token count, character density, and overhead multipliers.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Download CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Language</th>
                    <th className="p-3">Tokenizer Model</th>
                    <th className="p-3">Algorithm</th>
                    <th className="p-3 text-right">Tokens</th>
                    <th className="p-3 text-right">Words</th>
                    <th className="p-3 text-right">Tok/Word</th>
                    <th className="p-3 text-right">Chars/Tok</th>
                    <th className="p-3 text-right">Est. Cost</th>
                    <th className="p-3 text-right">Overhead vs EN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chartData.table_rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={
                        row.language === 'English'
                          ? 'bg-blue-50/20 hover:bg-blue-50/40'
                          : row.language === 'Hindi'
                          ? 'bg-amber-50/20 hover:bg-amber-50/40'
                          : 'bg-rose-50/20 hover:bg-rose-50/40'
                      }
                    >
                      <td className="p-3 font-semibold text-slate-900">{row.language}</td>
                      <td className="p-3 font-medium text-slate-800">{row.tokenizer}</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{row.algorithm}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{row.tokenCount}</td>
                      <td className="p-3 text-right font-mono text-slate-600">{row.wordCount}</td>
                      <td className="p-3 text-right font-mono font-bold text-indigo-700">{row.tokenToWordRatio}</td>
                      <td className="p-3 text-right font-mono text-slate-600">{row.charsPerToken}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">${row.costForVolume.toFixed(4)}</td>
                      <td className="p-3 text-right font-mono font-bold">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            row.multiplierVsEnglish > 2.0
                              ? 'bg-rose-100 text-rose-800'
                              : row.multiplierVsEnglish > 1.0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {row.multiplierVsEnglish}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
