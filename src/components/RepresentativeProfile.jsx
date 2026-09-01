import React, { useState, useEffect } from 'react';
import { ShieldCheck, Landmark, AlertTriangle, CheckCircle, FileText, ExternalLink, Calendar, MapPin, ChevronRight, User } from 'lucide-react';

export default function RepresentativeProfile({ repId = 'rep-1', onSelectProject }) {
  const [repData, setRepData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/representatives/${repId}`)
      .then(res => res.json())
      .then(data => {
        setRepData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [repId]);

  if (loading || !repData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 font-mono">
        Loading Representative Profile & Attribution Graph...
      </div>
    );
  }

  const { person, roles, fund_ledgers, projects, audit_findings } = repData;
  const ledger = fund_ledgers && fund_ledgers.length > 0 ? fund_ledgers[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Representative Header Card */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 relative overflow-hidden shadow-xl space-y-6">
        <div className="flex flex-wrap items-center gap-6">
          <img src={person.photo_url} alt={person.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-500/50 shadow-lg" />
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold border border-emerald-500/30">
                {person.party}
              </span>
              <span className="text-slate-400 text-xs font-mono">TENURE: {person.tenure_start} TO {person.tenure_end}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-100">{person.name}</h2>
            <p className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
              <Landmark className="w-4 h-4" />
              <span>{person.office_title} • {person.geography_name}</span>
            </p>
          </div>

          {/* Legislative Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center font-mono text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Attendance</div>
              <div className="text-base font-bold text-slate-100 mt-0.5">{person.attendance_pct}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Questions</div>
              <div className="text-base font-bold text-sky-400 mt-0.5">{person.questions_asked}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Debates</div>
              <div className="text-base font-bold text-amber-400 mt-0.5">{person.debates_participated}</div>
            </div>
          </div>
        </div>

        {/* PRD Attribution Taxonomy Drawer (Section 5.1 PRD) */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PRD Role Attribution Taxonomy (Prevents False Attribution)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roles.map(r => (
              <div key={r.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{r.institution_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
                    {r.role_type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Public Fund Ledger for Representative */}
      {ledger && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Attributed Fund Ledger: {ledger.scheme_name}</h3>
            <span className="text-xs font-mono text-slate-400">FY {ledger.fiscal_year}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">ENTITLED</span>
              <span className="font-bold text-slate-200 text-sm">₹{ledger.entitled_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">RELEASED</span>
              <span className="font-bold text-sky-400 text-sm">₹{ledger.released_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SANCTIONED</span>
              <span className="font-bold text-amber-400 text-sm">₹{ledger.sanctioned_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">EXPENDED (SPENT)</span>
              <span className="font-bold text-emerald-400 text-sm">₹{ledger.expended_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">UNSPENT BALANCE</span>
              <span className="font-bold text-rose-400 text-sm">₹{ledger.unspent_balance.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Red Flags & CAG Audit Findings */}
      {audit_findings && audit_findings.length > 0 && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-rose-900/30 bg-rose-950/5 space-y-3">
          <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>CAG / Audit Assurance Observations ({audit_findings.length})</span>
          </h3>

          <div className="space-y-3">
            {audit_findings.map(aud => (
              <div key={aud.id} className="bg-slate-900/90 p-4 rounded-xl border border-rose-900/40 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-200">{aud.report_title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                    SEVERITY: {aud.finding_severity}
                  </span>
                </div>
                <p className="text-slate-300 font-sans">{aud.finding_text}</p>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>Amount Involved: <strong className="text-amber-400">₹{aud.amount_involved.toLocaleString('en-IN')}</strong></span>
                  <span className="text-rose-400 font-bold">STATUS: {aud.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
