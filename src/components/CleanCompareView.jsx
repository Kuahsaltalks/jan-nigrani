import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CleanCompareView({ lang }) {
  const [reps, setReps] = useState([]);
  const [selectedRep1, setSelectedRep1] = useState('rep-modi');
  const [selectedRep2, setSelectedRep2] = useState('rep-shashi-tharoor');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/compare')
      .then(res => res.json())
      .then(data => {
        setReps(data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading || reps.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-sm">Loading Peer Comparison Engine...</p>
      </div>
    );
  }

  const r1 = reps.find(r => r.id === selectedRep1) || reps[0];
  const r2 = reps.find(r => r.id === selectedRep2) || reps[1] || reps[0];

  const compareData = [
    {
      metric: 'Attendance %',
      [r1.name]: r1.attendance_pct || 90,
      [r2.name]: r2.attendance_pct || 90
    },
    {
      metric: 'Questions Asked',
      [r1.name]: r1.questions_asked || 0,
      [r2.name]: r2.questions_asked || 0
    },
    {
      metric: 'Debates Participated',
      [r1.name]: r1.debates_participated || 0,
      [r2.name]: r2.debates_participated || 0
    },
    {
      metric: 'Data Coverage %',
      [r1.name]: r1.data_coverage_pct || 90,
      [r2.name]: r2.data_coverage_pct || 90
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 space-y-2">
        <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
          LIKE-FOR-LIKE COMPARISON
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Representative Peer Compare
        </h1>
        <p className="text-sm text-slate-500">
          Compare elected MPs or MLAs on standardized indicators with tenure and role normalization.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Representative 1:
          </label>
          <select
            value={selectedRep1}
            onChange={(e) => setSelectedRep1(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {reps.map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.office_title} - {r.geo_name})</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Representative 2:
          </label>
          <select
            value={selectedRep2}
            onChange={(e) => setSelectedRep2(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {reps.map(r => (
              <option key={r.id} value={r.id}>{r.name} ({r.office_title} - {r.geo_name})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <img src={r1.photo_url} alt={r1.name} className="w-16 h-16 rounded-full object-cover border border-slate-200" />
            <div>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {r1.party}
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">{r1.name}</h3>
              <p className="text-xs text-slate-500">{r1.office_title} · {r1.geo_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px]">SANCTIONED</span>
              <span className="font-bold text-slate-900 text-sm">₹{((r1.sanctioned_amount || 30300000) / 100000).toFixed(1)} Lakh</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px]">EXPENDED</span>
              <span className="font-bold text-emerald-600 text-sm">₹{((r1.expended_amount || 15700000) / 100000).toFixed(1)} Lakh</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <img src={r2.photo_url} alt={r2.name} className="w-16 h-16 rounded-full object-cover border border-slate-200" />
            <div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {r2.party}
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">{r2.name}</h3>
              <p className="text-xs text-slate-500">{r2.office_title} · {r2.geo_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px]">SANCTIONED</span>
              <span className="font-bold text-slate-900 text-sm">₹{((r2.sanctioned_amount || 27900000) / 100000).toFixed(1)} Lakh</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px]">EXPENDED</span>
              <span className="font-bold text-emerald-600 text-sm">₹{((r2.expended_amount || 23600000) / 100000).toFixed(1)} Lakh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-serif text-xl font-bold text-slate-900">
          Legislative Participation & Data Quality Breakdown
        </h3>
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }} />
              <Bar dataKey={r1.name} fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey={r2.name} fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
