import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ExternalLink, Award, CheckCircle2, Clock, AlertTriangle, Calendar, Building2, User } from 'lucide-react';

export default function CleanRepModal({ repId, onClose, onSelectProject }) {
  const [repData, setRepData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repId) return;
    setLoading(true);
    fetch(`/api/representatives/${repId}`)
      .then(res => res.json())
      .then(data => {
        setRepData(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [repId]);

  if (!repId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !repData ? (
          <div className="py-20 text-center text-slate-400 font-mono text-xs">
            Loading Representative Profile & Tenure Records...
          </div>
        ) : (() => {
          const person = repData.representative || repData.person;
          if (!person) return null;
          return (
          <div className="space-y-6">
            {/* Header: Photo, Name, Party, Office */}
            <div className="flex flex-wrap items-start gap-5 pr-8">
              <img
                src={person.photo_url}
                alt={person.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    {person.party}
                  </span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    person.tenure_status === 'CURRENT_INCUMBENT'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : person.tenure_status === 'PAST_TERM_ADMINISTERED'
                      ? 'bg-slate-100 text-slate-700 border border-slate-300'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {person.tenure_status === 'CURRENT_INCUMBENT' ? '🟢 Current Incumbent' : '⚪ Past Term (Completed)'}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {person.name}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {person.office_title} · {person.geography_name}
                </p>
              </div>
            </div>

            {/* Official Tenure & Government Status Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold font-mono text-slate-700 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Statutory Tenure & Election Status</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {person.tenure_label || `${person.tenure_start} – ${person.tenure_end}`}
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {person.status_note || 'Active elected representative in official government records.'}
              </p>
            </div>

            {/* Participation & Performance Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">ATTENDANCE</span>
                <span className="text-base font-bold text-slate-900">{person.attendance_pct}%</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">QUESTIONS</span>
                <span className="text-base font-bold text-slate-900">{person.questions_asked}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">DATA COVERAGE</span>
                <span className="text-base font-bold text-emerald-600">{person.data_coverage_pct}%</span>
              </div>
            </div>

            {/* Public Development Works Recommended / Tracked */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Works Recommended & Sourced Proofs ({repData.projects?.length || 0})
              </h3>
              
              {(!repData.projects || repData.projects.length === 0) ? (
                <div className="text-xs text-slate-400 font-mono py-4 text-center bg-slate-50 rounded-xl">
                  No individual works currently linked. Sourced from municipal and state LAD registers.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {repData.projects.map(p => (
                    <div
                      key={p.id}
                      onClick={() => { onClose(); onSelectProject(p.id); }}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 truncate">{p.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {p.sector} · Sanctioned: ₹{(p.sanctioned_cost / 100000).toFixed(1)}L
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono shrink-0 ${
                        p.proof_status === 'OFFICIAL_PROOF_VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.proof_status === 'CITIZEN_PROOF_ATTACHED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.proof_status === 'OFFICIAL_PROOF_VERIFIED' ? 'Proof Verified' : p.proof_status === 'CITIZEN_PROOF_ATTACHED' ? 'Citizen Proof' : 'Unverified'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Source Note */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>ECI / State Election Commission Record</span>
              <a
                href="https://eci.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Verify ECI Record</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          );
        })()}
      </div>
    </div>
  );
}
