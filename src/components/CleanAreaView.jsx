import React, { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, CheckCircle2, Clock, AlertCircle, ChevronRight, ExternalLink, ShieldCheck, Database, Camera, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export default function CleanAreaView({ areaId = 'geo-chhoti-ramdi', onSelectRep, onSelectProject, lang }) {
  const [areaData, setAreaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImagePreview, setActiveImagePreview] = useState(null);

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
        <p className="font-mono text-sm">Loading Public Accountability Graph & Ground Proofs...</p>
      </div>
    );
  }

  const { geography, representatives, fund_ledgers, projects } = areaData;

  // Calculate stats
  const totalSanctioned = fund_ledgers.reduce((acc, l) => acc + (l.sanctioned_amount || 0), 0);
  const totalExpended = fund_ledgers.reduce((acc, l) => acc + (l.expended_amount || 0), 0);
  const projectsCount = projects.length;
  const verifiedCount = projects.filter(p => p.proof_status === 'OFFICIAL_PROOF_VERIFIED').length;
  const unverifiedCount = projects.filter(p => p.proof_status === 'UNVERIFIED_NO_PROOF').length;

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

  const parseImages = (imgJson) => {
    if (!imgJson) return [];
    try {
      return JSON.parse(imgJson);
    } catch {
      return [];
    }
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
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mt-1">
              {geography.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500 font-medium">
              <span>{geography.type.replace('_', ' ').toLowerCase()} · {geography.state_name}</span>
              <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full text-xs border border-emerald-200/50">
                82% coverage
              </span>
              <span className="text-xs font-mono text-slate-400">
                LGD Code: <strong className="text-slate-700">#{geography.lgd_code}</strong>
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
              {totalSanctioned > 0 ? formatAmount(totalSanctioned) : '₹30.5L'}
            </div>
            <div className="text-xs text-slate-400">not an individual's spending</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-medium">Financial progress</div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              {totalExpended > 0 ? formatAmount(totalExpended) : '₹26.9L'}
            </div>
            <div className="text-xs text-slate-400">recorded expenditure</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-medium">Ground Proof Status</div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-600">
              {verifiedCount} Verified <span className="text-slate-400 text-lg font-normal">/ {unverifiedCount} Unverified</span>
            </div>
            <div className="text-xs text-slate-400">geo-tagged image verification</div>
          </div>
        </div>

        {/* 3. Direct Source Links Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Official Sourced Portals for {geography.name}:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono">
            <a
              href="https://egramswaraj.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>eGramSwaraj</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="https://mplads.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>MPLADS (MoSPI)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="https://panchayat.gov.in/en/lgd/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>LGD #{geography.lgd_code}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. Section: WHO GOVERNS HERE (4-Tier Statutory Crosswalk) */}
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
            Statutory crosswalk from Gram Pradhan &rarr; Mayor / Nagar Nigam &rarr; MLA &rarr; MP.
          </p>
        </div>

        {/* Representative & Institution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {representatives.map((rep, idx) => {
            const isPradhan = rep.office_title.toLowerCase().includes('pradhan');
            const isMayor = rep.office_title.toLowerCase().includes('mayor');
            const isMLA = rep.office_title.toLowerCase().includes('mla') || rep.office_title.toLowerCase().includes('assembly');
            const isMP = rep.office_title.toLowerCase().includes('mp') || rep.office_title.toLowerCase().includes('parliament');

            const badgeLabel = isPradhan
              ? 'Gram Pradhan'
              : isMayor
              ? 'Mayor (City Chief)'
              : isMLA
              ? 'MLA (State Assembly)'
              : 'MP (Lok Sabha)';

            const badgeColor = isPradhan
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : isMayor
              ? 'bg-teal-50 text-teal-700 border-teal-200'
              : isMLA
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-purple-50 text-purple-700 border-purple-200';

            const isIncumbent = rep.tenure_status === 'CURRENT_INCUMBENT';

            return (
              <div
                key={rep.id}
                onClick={() => onSelectRep(rep.id)}
                className="bg-white hover:bg-slate-50/80 p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rep.photo_url}
                      alt={rep.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                          {badgeLabel}
                        </span>
                        <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                          isIncumbent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {isIncumbent ? '🟢 Current' : '⚪ Past Term'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight truncate mt-1 group-hover:text-indigo-600 transition-colors">
                        {rep.name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500">
                    <p className="line-clamp-2">{rep.office_title}</p>
                    <p className="font-mono text-[11px] text-slate-400">{rep.party}</p>
                    <div className="text-[11px] font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 mt-1">
                      <span className="text-slate-400 block text-[9px] uppercase">Statutory Tenure:</span>
                      <strong>{rep.tenure_label || `${rep.tenure_start} – ${rep.tenure_end}`}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Attendance: <strong className="text-slate-800">{rep.attendance_pct}%</strong></span>
                  <span className="text-[11px] text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5">
                    <span>View Record</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Section: PUBLISHED EVIDENCE & GROUND PROOFS */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              PUBLISHED EVIDENCE & GROUND PROOFS
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Public development works & proof verification ({projects.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Geo-tagged photos uploaded as evidence of work done. Click any work to inspect audit vouchers.
          </p>
        </div>

        <div className="space-y-6">
          {projects.map(proj => {
            const images = parseImages(proj.image_urls);
            const isVerified = proj.proof_status === 'OFFICIAL_PROOF_VERIFIED';
            const isCitizen = proj.proof_status === 'CITIZEN_PROOF_ATTACHED';

            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className="bg-white hover:bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4"
              >
                {/* Header Row */}
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

                {/* Proof Verification Banner */}
                <div className={`p-3.5 rounded-xl text-xs space-y-1.5 border ${
                  isVerified
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : isCitizen
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : 'bg-rose-50/70 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-center gap-2 font-bold font-mono uppercase tracking-wider">
                    {isVerified ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Official Proof Submitted & Verified</span>
                      </>
                    ) : isCitizen ? (
                      <>
                        <Camera className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-700">Citizen Ground Evidence Attached</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-700">No Ground Proof Submitted (Unverified)</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed opacity-90">
                    {proj.proof_summary}
                  </p>

                  <div className="text-[11px] font-mono opacity-80 pt-0.5">
                    <strong>Submission Record:</strong> {proj.proof_by}
                  </div>
                </div>

                {/* Ground Images Gallery (if proof photos submitted) */}
                {images.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Uploaded Ground Proof Photos ({images.length})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {images.map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={(e) => { e.stopPropagation(); setActiveImagePreview(imgUrl); }}
                          className="relative rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-500 transition-all cursor-zoom-in group shadow-sm"
                        >
                          <img
                            src={imgUrl}
                            alt="Ground Work Verification"
                            className="w-32 h-20 sm:w-40 sm:h-24 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-semibold">
                            View Proof ↗
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Bar & Portal Link */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>Physical Progress</span>
                    <span className="font-bold text-slate-800">{proj.physical_progress_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isVerified ? 'bg-emerald-600' : isCitizen ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${proj.physical_progress_pct}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                    <span>Source: {proj.source_name}</span>
                    <a
                      href={proj.source_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Verify on Government Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Zoom Modal */}
      {activeImagePreview && (
        <div
          onClick={() => setActiveImagePreview(null)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImagePreview}
              alt="Full Resolution Proof"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
            <div className="p-3 text-center text-xs font-mono text-slate-600 flex items-center justify-between">
              <span>Official Geo-tagged Ground Proof Photo</span>
              <button
                onClick={() => setActiveImagePreview(null)}
                className="font-bold text-indigo-600 hover:underline"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
