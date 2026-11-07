import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Upload, Volume2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../services/api';
import type { AudioSample, TranscriptionResponse } from '../types';

interface AudioRecorderProps {
  onTranscriptReady: (transcript: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscriptReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResponse | null>(null);

  // Curated samples from backend
  const [samples, setSamples] = useState<AudioSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<AudioSample | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load sample audio clips on mount
  useEffect(() => {
    apiClient.getAudioSamples()
      .then((data) => {
        setSamples(data);
        if (data.length > 0) {
          setSelectedSample(data[0]);
        }
      })
      .catch((err) => console.error('Failed to load audio samples:', err));
  }, []);

  // Timer effect during recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setErrorMsg(null);
      setTranscriptionResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err: any) {
      setErrorMsg('Microphone access denied or unsupported browser. Please upload an audio file or select a verified sample clip.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioElementRef.current && audioUrl) {
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => setIsPlaying(false);
    }

    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrorMsg(null);
      setTranscriptionResult(null);
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const transcribeCurrentAudio = async () => {
    if (!audioBlob) return;
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const filename = (audioBlob as File).name || 'microphone_recording.wav';
      const fileToUpload = audioBlob instanceof File
        ? audioBlob
        : new File([audioBlob], filename, { type: audioBlob.type || 'audio/wav' });

      const res = await apiClient.transcribeAudio(fileToUpload);
      setTranscriptionResult(res);
      if (res.transcript) {
        onTranscriptReady(res.transcript);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || err.message || 'Audio transcription failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: AudioSample) => {
    setSelectedSample(sample);
    setErrorMsg(null);
    setAudioUrl(sample.audio_url);
    setTranscriptionResult({
      transcript: sample.full_transcript,
      engine: 'Verified Hindi Acoustic Benchmark (Whisper ground-truth)',
      is_live_api: false,
      filename: sample.filename,
      status: 'success',
      detected_language: 'Hindi (hi)',
    });
    onTranscriptReady(sample.full_transcript);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            Hindi Speech & Audio Input
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Record via microphone, upload a .wav/.mp3 file, or test with authentic verified Hindi speech clips.
          </p>
        </div>
        <span className="text-xs font-mono bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md">
          OpenAI Whisper API
        </span>
      </div>

      {/* Preset sample clips */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 block flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Curated Hindi Audio Benchmarks
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {samples.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectSample(s)}
              className={`p-2.5 text-left rounded-lg border text-xs transition cursor-pointer ${
                selectedSample?.id === s.id
                  ? 'border-indigo-500 bg-indigo-50/60 font-semibold'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-800 font-bold truncate">{s.title}</span>
                <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-1 py-0.5 rounded">
                  {s.duration}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1 font-serif">
                "{s.transcript_preview}"
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 block">
          Or Record / Upload Your Own Audio
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mic Button */}
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-rose-700 transition cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              Record Voice
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-black transition animate-pulse cursor-pointer"
            >
              <Square className="w-4 h-4 text-rose-400" />
              Stop Recording ({recordingDuration}s)
            </button>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.wav,.mp3,.m4a,.ogg,.webm"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Audio Playback Controls if audio is ready */}
          {audioUrl && (
            <button
              type="button"
              onClick={togglePlayback}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Play Audio'}
            </button>
          )}

          {/* Transcribe Trigger */}
          {audioBlob && (
            <button
              type="button"
              onClick={transcribeCurrentAudio}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              {isLoading ? 'Transcribing with Whisper...' : 'Transcribe Audio'}
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Transcription Output Card */}
      {transcriptionResult && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Hindi Transcript Output
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              Engine: {transcriptionResult.engine}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded font-serif text-sm text-slate-900 leading-relaxed">
            "{transcriptionResult.transcript}"
          </div>

          {transcriptionResult.note && (
            <p className="text-[11px] text-slate-500 italic">
              ℹ️ {transcriptionResult.note}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => onTranscriptReady(transcriptionResult.transcript)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Send to Tokenizer Explorer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
