import React, { useState } from 'react';
import { Bot, Send, Sparkles, Filter, CheckCircle2, AlertCircle, Database, ChevronRight, X, RefreshCw } from 'lucide-react';

export default function JanNigraniRAGAssistant({ onSelectRep, onSelectArea, onSelectProject }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sampleQuestions = [
    "What works has Modi done in Varanasi under MPLADS?",
    "Show me Rahul Gandhi's initiatives in Rae Bareli",
    "What projects has Amit Shah sanctioned in Gandhinagar?",
    "Ongoing roads and health works in Haldwani by MLA Sumit Hridayesh",
    "What assembly segments are in Amritsar parliamentary constituency?",
    "Drinking water and CC road in Choti Ramdi Gram Sabha"
  ];

  const handleAsk = async (userQuestion) => {
    const q = userQuestion || query;
    if (!q.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({
        answer: "Unable to complete semantic retrieval at this moment. Please verify backend connectivity.",
        filters_applied: {},
        retrieved_chunks: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-500/20 space-y-6 relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>INCREMENTAL RAG & CONSTITUENCY INTELLIGENCE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ask Jan Nigrani AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Query any MP, MLA, Gram Sabha, or Delimitation record across India with verified ground proofs and zero cross-constituency hallucinations.
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
          className="relative flex items-center shadow-2xl z-10"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything (e.g., 'What works has Modi done in Varanasi?' or 'Rahul Gandhi Rae Bareli works')..."
            className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-2xl pl-5 pr-32 py-4 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ask AI</span>
              </>
            )}
          </button>
        </form>

        {/* Sample Query Prompts */}
        <div className="flex flex-wrap items-center gap-2 text-xs relative z-10">
          <span className="text-slate-400 font-mono text-[11px]">Quick Prompts:</span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setQuery(sq); handleAsk(sq); }}
              className="bg-slate-800/80 hover:bg-indigo-900/60 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all text-left"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* RAG Answer Display */}
        {result && (
          <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative z-10 border border-slate-200 animate-fade-in">
            {/* Metadata Pre-Filters Applied Badge */}
            {result.filters_applied && Object.keys(result.filters_applied).length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-slate-500 font-bold uppercase text-[10px]">
                  <Filter className="w-3 h-3 text-indigo-600" />
                  <span>Hard Anti-Hallucination Filters:</span>
                </div>
                {Object.entries(result.filters_applied).map(([k, v]) => (
                  <span key={k} className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md font-semibold border border-indigo-100">
                    {k}: <strong className="text-slate-900">{v}</strong>
                  </span>
                ))}
              </div>
            )}

            {/* Answer Content */}
            <div className="prose prose-sm max-w-none text-slate-800 space-y-3 font-sans leading-relaxed whitespace-pre-line text-sm">
              {result.answer}
            </div>

            {/* Retrieved Evidence Chunks */}
            {result.retrieved_chunks && result.retrieved_chunks.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Retrieved Semantic Evidence Chunks ({result.retrieved_chunks.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.retrieved_chunks.map((chunk, idx) => (
                    <div
                      key={chunk.id || idx}
                      className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs font-mono space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-bold text-slate-700">{chunk.metadata.constituency} ({chunk.metadata.representative_type})</span>
                        <span className="text-emerald-600 font-semibold">Similarity: {(chunk.score * 100).toFixed(1)}%</span>
                      </div>
                      <p className="text-slate-600 text-[11px] line-clamp-3 font-sans">
                        {chunk.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
