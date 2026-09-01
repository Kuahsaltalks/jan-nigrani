import React, { useState, useEffect } from 'react';
import { GitCommit, ArrowRight, DollarSign, Building, FileCheck, ShieldAlert, CheckCircle, ExternalLink, ChevronDown } from 'lucide-react';

export default function MoneyTrailViewer({ onSelectProject }) {
  const [ledgers, setLedgers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedLedgerId, setSelectedLedgerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/representatives/rep-1').then(res => res.json()),
      fetch('/api/projects').then(res => res.json())
    ]).then(([repData, projsData]) => {
      setLedgers(repData.fund_ledgers || []);
      if (repData.fund_ledgers && repData.fund_ledgers.length > 0) {
        setSelectedLedgerId(repData.fund_ledgers[0].id);
      }
      setProjects(projsData || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 font-mono">
        Loading Rupee-by-Rupee Money Trail Graph...
      </div>
    );
  }

  const currentLedger = ledgers.find(l => l.id === selectedLedgerId) || ledgers[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <GitCommit className="w-4 h-4" />
            <span>PRD SIGNATURE INTERACTION • SECTION 6.3</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-1">The Public Money Trail Graph</h2>
          <p className="text-xs text-slate-400 mt-1">
            Trace every single rupee from high-level Ministry/Grant Releases down to specific Sanction Orders, Tenders, Geo-tagged Assets, and Audit Findings.
          </p>
        </div>

        {/* Scheme Selector */}
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 px-2">Select Scheme:</span>
          <select
            value={selectedLedgerId}
            onChange={(e) => setSelectedLedgerId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-bold focus:outline-none"
          >
            {ledgers.map(l => (
              <option key={l.id} value={l.id}>
                {l.scheme_name} (FY {l.fiscal_year})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Money Trail Flow Diagram */}
      {currentLedger && (
        <div className="space-y-6">
          {/* Step 1: Scheme Grant Release */}
          <div className="relative pl-8 border-l-2 border-amber-500/50 space-y-3">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-950">1</div>
            
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">STAGE 1: CENTRAL / STATE GRANT RELEASE</span>
                <span className="text-slate-500">Source: {currentLedger.source_name}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">ENTITLED CEILING</span>
                  <span className="text-base font-bold text-slate-200">₹{currentLedger.entitled_amount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">RELEASED TRANCHE</span>
                  <span className="text-base font-bold text-sky-400">₹{currentLedger.released_amount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">SANCTIONED COMMITMENT</span>
                  <span className="text-base font-bold text-amber-400">₹{currentLedger.sanctioned_amount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">EXPENDED (SPENT)</span>
                  <span className="text-base font-bold text-emerald-400">₹{currentLedger.expended_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Individual Sanction Orders & Works */}
          <div className="relative pl-8 border-l-2 border-emerald-500/50 space-y-4">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-950">2</div>
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">
                STAGE 2: SANCTIONED WORKS CONSUMING THE RELEASE
              </h3>
              <span className="text-xs text-slate-400 font-mono">Mapped Projects: {projects.length}</span>
            </div>

            <div className="space-y-4">
              {projects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className="bg-slate-950 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                        <span>SANCTION CODE: {proj.source_work_id}</span>
                        <span>•</span>
                        <span className="text-slate-400">{proj.sector}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-100 mt-1">{proj.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Implementing Agency: {proj.implementing_dept}</p>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-[10px] text-slate-500 uppercase">Sanctioned vs Expended</div>
                      <div className="text-sm font-bold text-amber-400">₹{proj.sanctioned_cost.toLocaleString('en-IN')}</div>
                      <div className="text-xs font-bold text-emerald-400">Spent: ₹{proj.spent_cost.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  {/* Procurement & Contract Sub-block */}
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-sky-400" />
                      <span className="text-slate-300">CPPP Tender: <strong className="text-slate-100">CPPP-2025-PWD-VAR-8841</strong></span>
                    </div>
                    <div className="text-slate-400">
                      Awarded Vendor: <span className="text-emerald-400 font-bold">Purvanchal Infra Solutions Pvt Ltd</span>
                    </div>
                    <a
                      href={proj.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Official Source Snap</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
