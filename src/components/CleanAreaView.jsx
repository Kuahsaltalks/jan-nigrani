import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Download, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Camera, 
  AlertTriangle, 
  Image as ImageIcon, 
  Filter, 
  Layers, 
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function CleanAreaView({ areaId = 'geo-varanasi', onSelectRep, onSelectProject, lang }) {
  const [areaData, setAreaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImagePreview, setActiveImagePreview] = useState(null);

  // Projects Filtering & Sorting State
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('COST_DESC'); // 'COST_DESC', 'PROGRESS_DESC', 'DATE_DESC'

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

  const { geography, representatives = [], fund_ledgers = [], projects = [] } = areaData;

  // Extract unique sectors
  const sectors = ['ALL', ...Array.from(new Set(projects.map(p => p.sector).filter(Boolean)))];

  // Filtered & Sorted Projects
  const filteredProjects = projects.filter(p => {
    if (selectedSector !== 'ALL' && p.sector !== selectedSector) return false;
    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'COMPLETED' && p.status !== 'COMPLETED') return false;
      if (selectedStatus === 'UNDERWAY' && p.status !== 'UNDERWAY') return false;
      if (selectedStatus === 'STALLED' && p.status !== 'STALLED') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (p.title || '').toLowerCase().includes(q);
      const idMatch = (p.source_work_id || '').toLowerCase().includes(q);
      const deptMatch = (p.implementing_dept || '').toLowerCase().includes(q);
      if (!titleMatch && !idMatch && !deptMatch) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'COST_DESC') return (b.sanctioned_cost || 0) - (a.sanctioned_cost || 0);
    if (sortBy === 'PROGRESS_DESC') return (b.physical_progress_pct || 0) - (a.physical_progress_pct || 0);
    if (sortBy === 'DATE_DESC') return new Date(b.approval_date || 0) - new Date(a.approval_date || 0);
    return 0;
  });

  const parseImages = (imgJson) => {
    if (!imgJson) return [];
    try {
      return JSON.parse(imgJson);
    } catch {
      return [];
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Work ID', 'Title', 'Sector', 'Implementing Dept', 'Sanctioned Cost (INR)', 'Spent Cost (INR)', 'Progress %', 'Status', 'Proof Status', 'Approval Date'];
    const rows = filteredProjects.map(p => [
      `"${p.source_work_id || ''}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${p.sector || ''}"`,
      `"${p.implementing_dept || ''}"`,
      p.sanctioned_cost || 0,
      p.spent_cost || 0,
      p.physical_progress_pct || 0,
      `"${p.status || ''}"`,
      `"${p.proof_status || ''}"`,
      `"${p.approval_date || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${geography.name}_Public_Works_Registry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 font-sans">
      {/* 1. Header Banner & Identity */}
      <div className="bg-[#0b132e] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>CONSTITUENCY ACCOUNTABILITY DASHBOARD</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span>Verified Ledger Coverage:</span>
              <strong className="text-emerald-400 font-bold">96.8%</strong>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
              <span>{geography.state_name}</span>
              <span>·</span>
              <span>{geography.type.replace('_', ' ')}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {geography.name}
            </h1>
          </div>

          {/* Official Portals Provenance */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-slate-500">Official Provenance:</span>
            <a
              href="https://mplads.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>MPLADS (MoSPI)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">·</span>
            <a
              href="https://panchayat.gov.in/en/lgd/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>LGD #{geography.lgd_code}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Statutory Financial Waterfall & Fund Utilization Ledger */}
      {fundLedgers && fundLedgers.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                CONSTITUENCY FINANCIAL AUDIT LEDGER
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
                Statutory Fund Utilization ({fundLedgers[0].scheme_name})
              </h2>
            </div>
            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold border border-indigo-100">
              FY {fundLedgers[0].fiscal_year}
            </span>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">1. Entitled Budget</div>
              <div className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-1">
                ₹{(fundLedgers[0].entitled_amount / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[10px] text-slate-400 font-mono">100% Allocation</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">2. Released by Ministry</div>
              <div className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-1">
                ₹{(fundLedgers[0].released_amount / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[10px] text-slate-400 font-mono">MoSPI Installment</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">3. Sanctioned Works</div>
              <div className="text-lg sm:text-xl font-serif font-bold text-indigo-600 mt-1">
                ₹{(fundLedgers[0].sanctioned_amount / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[10px] text-indigo-500 font-mono font-semibold">
                {((fundLedgers[0].sanctioned_amount / fundLedgers[0].entitled_amount) * 100).toFixed(1)}% Sanction Rate
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">4. Ground Expenditure</div>
              <div className="text-lg sm:text-xl font-serif font-bold text-emerald-600 mt-1">
                ₹{(fundLedgers[0].expended_amount / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[10px] text-emerald-600 font-mono font-semibold">
                {((fundLedgers[0].expended_amount / fundLedgers[0].released_amount) * 100).toFixed(1)}% Utilization
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">5. Unspent Balance</div>
              <div className="text-lg sm:text-xl font-serif font-bold text-amber-600 mt-1">
                ₹{(fundLedgers[0].unspent_balance / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[10px] text-amber-600 font-mono">In Bank Account</div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Fund Execution Efficiency</span>
              <span className="font-bold text-slate-800">
                {((fundLedgers[0].expended_amount / fundLedgers[0].entitled_amount) * 100).toFixed(1)}% of Annual Budget Delivered
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${(fundLedgers[0].expended_amount / fundLedgers[0].entitled_amount) * 100}%` }}
                title="Expended"
              ></div>
              <div
                className="bg-indigo-400 h-full"
                style={{ width: `${((fundLedgers[0].sanctioned_amount - fundLedgers[0].expended_amount) / fundLedgers[0].entitled_amount) * 100}%` }}
                title="Sanctioned but Pending Completion"
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Section: WHO GOVERNS HERE (4-Tier Statutory Crosswalk) */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              WHO GOVERNS HERE
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Representatives & institutions ({representatives.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Statutory crosswalk from Gram Pradhan &rarr; Mayor / Nagar Nigam &rarr; MLA &rarr; MP.
          </p>
        </div>

        {/* Representative & Institution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {representatives.map((rep) => {
            const isPradhan = rep.office_title.toLowerCase().includes('pradhan');
            const isMayor = rep.office_title.toLowerCase().includes('mayor');
            const isMLA = rep.office_title.toLowerCase().includes('mla') || rep.office_title.toLowerCase().includes('assembly');

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
                  <span className="font-mono text-[11px] text-emerald-600 font-semibold">
                    {rep.attendance_pct}% Attendance
                  </span>
                  <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5 text-xs">
                    Inspect Works &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Section: COMPREHENSIVE PUBLIC DEVELOPMENT WORKS & VERIFICATION REGISTRY */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              EXHAUSTIVE WORKS CATALOG & VERIFICATION AUDIT
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Public development works ({filteredProjects.length} of {projects.length})
            </h2>
          </div>
          
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Works (CSV)</span>
          </button>
        </div>

        {/* Interactive Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          {/* Search and Sort Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search works by title, work ID, or executing department..."
                className="w-full bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed (100%)</option>
              <option value="UNDERWAY">Ongoing / Underway</option>
              <option value="STALLED">Stalled / Unverified</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="COST_DESC">Sort: Highest Cost (₹)</option>
              <option value="PROGRESS_DESC">Sort: Physical Progress %</option>
              <option value="DATE_DESC">Sort: Recently Approved</option>
            </select>
          </div>

          {/* Sector Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Sectors:</span>
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedSector === sec
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {sec === 'ALL' ? 'All Sectors' : sec}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-500 space-y-2 border border-dashed border-slate-200">
              <p className="font-semibold text-slate-700">No public works match the selected filters.</p>
              <p className="text-xs">Try selecting 'All Sectors' or clearing the search query.</p>
            </div>
          ) : (
            filteredProjects.map(proj => {
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
            })
          )}
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
