import React, { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, CheckCircle2, Clock, AlertCircle, ChevronRight, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CleanAreaView({ areaId = 'geo-varanasi', onSelectRep, onSelectProject, lang }) {
  const [areaData, setAreaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/areas/${areaId}`)
      .then(res => res.json())
      .then(data => {
        setAreaData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load area data:", err);
        setLoading(false);
      });
  }, [areaId]);

  if (loading || !areaData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-sm">Loading Public Accountability Graph...</p>
      </div>
    );
  }

  const { geography, representatives, fund_ledgers, projects } = areaData;

  // Calculate stats
  const totalSanctioned = fund_ledgers.reduce((acc, l) => acc + (l.sanctioned_amount || 0), 0);
  const totalExpended = fund_ledgers.reduce((acc, l) => acc + (l.expended_amount || 0), 0);
  const projectsCount = projects.length;
  const conflictingEvidenceCount = 0;

  // Format to Lakhs/Crores
  const formatAmount = (num) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    }
    return `₹${Math.round(num / 100000)}L`;
  };

  const getInitials = (name) => {
    if (!name) return 'IN';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      {/* 1. Header: YOUR AREA */}
      <div className="space-y-4 border-b border-slate-100 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              YOUR AREA
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mt-1">
              {geography.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 font-medium">
              <span>{geography.type.replace('_', ' ').toLowerCase()} · {geography.state_name}</span>
              <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full text-xs border border-emerald-200/50">
                82% coverage
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-sans">
            Last refreshed <strong className="text-slate-700 font-semibold">31 Aug 2026, 10:08 pm</strong>
          </div>
        </div>

        {/* 2. 4 Clean Key Metrics Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-medium">Projects tracked</div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              {String(projectsCount).padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-400">across published sources</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-medium">Sanctioned works</div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              {formatAmount(totalSanctioned)}
            </div>
            <div className="text-xs text-slate-400">not an individual's spending</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-medium">Financial progress</div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              {formatAmount(totalExpended)}
            </div>
            <div className="text-xs text-slate-400">recorded expenditure</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-medium">Conflicting evidence</div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              {String(conflictingEvidenceCount).padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-400">shown separately from official data</div>
          </div>
        </div>
      </div>

      {/* 3. Section: WHO GOVERNS HERE */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              WHO GOVERNS HERE
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Representatives & institutions
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            The role badge shows the strength of the relationship in the official record.
          </p>
        </div>

        {/* Representative & Institution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {representatives.map((rep, idx) => {
            const isDirect = idx === 0;
            const badgeColor = isDirect
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : idx === 1
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200';
            
            const badgeLabel = isDirect
              ? 'Direct recommendation'
              : idx === 1
              ? 'Jurisdiction exposure'
              : 'Implementing authority';

            return (
              <div
                key={rep.id}
                onClick={() => onSelectRep(rep.id)}
                className="bg-white hover:bg-slate-50/80 p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-bold font-mono text-sm flex items-center justify-center border border-slate-200 shrink-0">
                    {getInitials(rep.name)}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor}`}>
                      {badgeLabel}
                    </span>

                    <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                      {rep.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {rep.office_title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {rep.party}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>MPLADS Allocation: <strong className="text-slate-800">₹5.00 Cr</strong></span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}

          {/* Local Authority Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-800 font-bold font-mono text-sm flex items-center justify-center border border-teal-200 shrink-0">
                VM
              </div>
              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  Implementing authority
                </span>
                <h3 className="font-bold text-slate-900 text-base leading-tight">
                  {geography.name} Municipal Corp / PWD
                </h3>
                <p className="text-xs text-slate-500">
                  Urban Local Body / Execution Engineering Wing
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Status: <strong className="text-emerald-600">Active Works Certified</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Section: PUBLISHED WORKS & AUDIT TRAILS */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              PUBLISHED EVIDENCE
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Public development works ({projects.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Click any work to view sanction dates, tenders, and exact financial progress.
          </p>
        </div>

        <div className="space-y-4">
          {projects.map(proj => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className="bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>WORK ID: {proj.source_work_id}</span>
                    <span>·</span>
                    <span className="text-indigo-600 font-semibold">{proj.sector}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Implementing Agency: <strong className="text-slate-700">{proj.implementing_dept}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    proj.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    proj.status === 'UNDERWAY' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {proj.status}
                  </span>
                  <div className="mt-2 text-xs font-mono text-slate-500">
                    Sanctioned: <strong className="text-slate-900">₹{(proj.sanctioned_cost / 100000).toFixed(1)}L</strong>
                  </div>
                  <div className="text-xs font-mono text-emerald-600 font-bold">
                    Spent: ₹{(proj.spent_cost / 100000).toFixed(1)}L
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Physical Progress</span>
                  <span className="font-bold text-slate-800">{proj.physical_progress_pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${proj.physical_progress_pct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
