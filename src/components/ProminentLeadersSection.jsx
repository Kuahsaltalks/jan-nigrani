import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, ChevronRight, UserCheck, Award, Filter, ExternalLink } from 'lucide-react';

export default function ProminentLeadersSection({ onSelectRep, lang }) {
  const [leaders, setLeaders] = useState([]);
  const [selectedParty, setSelectedParty] = useState('ALL'); // 'ALL', 'BJP', 'INC', 'OTHERS'

  useEffect(() => {
    fetch('/api/representatives')
      .then(res => res.json())
      .then(data => {
        setLeaders(data || []);
      })
      .catch(console.error);
  }, []);

  const filterLeaders = () => {
    if (selectedParty === 'ALL') return leaders;
    if (selectedParty === 'BJP') return leaders.filter(l => l.party.includes('BJP'));
    if (selectedParty === 'INC') return leaders.filter(l => l.party.includes('INC') || l.party.includes('Congress'));
    if (selectedParty === 'OTHERS') return leaders.filter(l => !l.party.includes('BJP') && !l.party.includes('INC') && !l.party.includes('Congress'));
    return leaders;
  };

  const filtered = filterLeaders();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header & Category Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="text-[11px] font-mono font-bold tracking-widest text-indigo-600 uppercase flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-indigo-600" />
            <span>NATIONAL ACCOUNTABILITY ROSTER</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
            Prominent Ministers & Parliamentary Leaders
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Directly inspect the parliamentary questions, attendance, MPLADS funds, and physical ground work proofs for key leaders across all major parties.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setSelectedParty('ALL')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              selectedParty === 'ALL'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Leaders ({leaders.length})
          </button>
          <button
            onClick={() => setSelectedParty('BJP')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              selectedParty === 'BJP'
                ? 'bg-orange-500 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            BJP / NDA
          </button>
          <button
            onClick={() => setSelectedParty('INC')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              selectedParty === 'INC'
                ? 'bg-sky-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Congress / INDIA
          </button>
          <button
            onClick={() => setSelectedParty('OTHERS')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              selectedParty === 'OTHERS'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Regional / Key State
          </button>
        </div>
      </div>

      {/* Interactive Leaders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(leader => {
          const isBJP = leader.party.includes('BJP');
          const isINC = leader.party.includes('INC') || leader.party.includes('Congress');

          const partyColor = isBJP
            ? 'bg-orange-50 text-orange-700 border-orange-200'
            : isINC
            ? 'bg-sky-50 text-sky-700 border-sky-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200';

          return (
            <div
              key={leader.id}
              onClick={() => onSelectRep(leader.id)}
              className="bg-white hover:bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={leader.photo_url}
                    alt={leader.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0 group-hover:border-indigo-400 transition-colors"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${partyColor}`}>
                      {isBJP ? 'BJP' : isINC ? 'INC' : leader.party.split(' ')[0]}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight truncate group-hover:text-indigo-600 transition-colors">
                      {leader.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono leading-tight truncate">
                      {leader.geography_name || 'India'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {leader.office_title}
                </p>

                <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-0.5">
                  <div><strong>Tenure:</strong> {leader.tenure_label || `${leader.tenure_start} – ${leader.tenure_end}`}</div>
                  <div className="text-emerald-700 font-semibold">Attendance: {leader.attendance_pct}% · Questions: {leader.questions_asked}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:underline">
                <span>Inspect Full Works Record</span>
                <ChevronRight className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
