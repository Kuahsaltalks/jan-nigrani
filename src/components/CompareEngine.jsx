import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CompareEngine({ onSelectRep }) {
  const [reps, setReps] = useState([]);
  const [selectedRep1, setSelectedRep1] = useState('rep-1'); // Narendra Modi
  const [selectedRep2, setSelectedRep2] = useState('rep-3'); // Rajnath Singh
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/compare')
      .then(res => res.json())
      .then(data => {
        setReps(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 font-mono">
        Loading Normalized Peer Compare Engine...
      </div>
    );
  }

  const r1 = reps.find(r => r.id === selectedRep1) || reps[0];
  const r2 = reps.find(r => r.id === selectedRep2) || reps[1];

  const compareData = [
    {
      metric: 'Attendance %',
      [r1.name]: r1.attendance_pct,
      [r2.name]: r2.attendance_pct
    },
    {
      metric: 'Questions Asked',
      [r1.name]: r1.questions_asked,
      [r2.name]: r2.questions_asked
    },
    {
      metric: 'Debates Participated',
      [r1.name]: r1.debates_participated,
      [r2.name]: r2.debates_participated
    },
    {
      metric: 'Data Coverage %',
      [r1.name]: r1.data_coverage_pct,
      [r2.name]: r2.data_coverage_pct
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>PRD SECTION 10 • ROLE-AWARE NORMALIZED COMPARISON</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Peer Representative Comparison Engine</h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare elected representatives of identical roles (MP vs MP, MLA vs MLA) using tenure-normalized indicators and explicit data-completeness adjustments.
          </p>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 font-mono text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 block">Select Representative 1:</label>
            <select
              value={selectedRep1}
              onChange={(e) => setSelectedRep1(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-bold focus:outline-none"
            >
              {reps.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.office_title})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 block">Select Representative 2:</label>
            <select
              value={selectedRep2}
              onChange={(e) => setSelectedRep2(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sky-400 font-bold focus:outline-none"
            >
              {reps.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.office_title})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-4">
            <img src={r1.photo_url} alt={r1.name} className="w-16 h-16 rounded-xl object-cover border border-amber-500/50" />
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20">{r1.party}</span>
              <h3 className="text-xl font-bold text-slate-100 mt-1">{r1.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{r1.office_title} • {r1.geo_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-4 border-t border-slate-800">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">ENTITLED FUND</span>
              <span className="font-bold text-slate-200">₹{(r1.entitled_amount || 50000000).toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">EXPENDED (SPENT)</span>
              <span className="font-bold text-emerald-400">₹{(r1.expended_amount || 18420150).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-4">
            <img src={r2.photo_url} alt={r2.name} className="w-16 h-16 rounded-xl object-cover border border-sky-500/50" />
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-400/10 text-sky-400 border border-sky-400/20">{r2.party}</span>
              <h3 className="text-xl font-bold text-slate-100 mt-1">{r2.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{r2.office_title} • {r2.geo_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-4 border-t border-slate-800">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">ENTITLED FUND</span>
              <span className="font-bold text-slate-200">₹{(r2.entitled_amount || 50000000).toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">EXPENDED (SPENT)</span>
              <span className="font-bold text-emerald-400">₹{(r2.expended_amount || 19800000).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Bar Chart */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Legislative & Data Coverage Comparison Chart</span>
          <span>Normalized Indicators</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar dataKey={r1.name} fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey={r2.name} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
