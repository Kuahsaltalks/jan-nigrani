import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  ChevronRight, 
  ExternalLink, 
  MapPin, 
  Download, 
  CheckCircle2, 
  Camera, 
  AlertTriangle, 
  Building2,
  Sparkles
} from 'lucide-react';

export default function CleanProjectsView({ onSelectProject, lang }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('COST_DESC'); // 'COST_DESC', 'PROGRESS_DESC', 'DATE_DESC'

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-sm">Loading Pan-India Development Projects & Audit Ledgers...</p>
      </div>
    );
  }

  const sectors = ['ALL', ...Array.from(new Set(projects.map(p => p.sector).filter(Boolean)))];

  const filtered = projects.filter(p => {
    const matchesSector = sectorFilter === 'ALL' || p.sector === sectorFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      (p.title || '').toLowerCase().includes(q) || 
      (p.geo_name && p.geo_name.toLowerCase().includes(q)) ||
      (p.source_work_id && p.source_work_id.toLowerCase().includes(q)) ||
      (p.recommender_name && p.recommender_name.toLowerCase().includes(q)) ||
      (p.implementing_dept && p.implementing_dept.toLowerCase().includes(q));
    
    return matchesSector && matchesStatus && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'COST_DESC') return (b.sanctioned_cost || 0) - (a.sanctioned_cost || 0);
    if (sortBy === 'PROGRESS_DESC') return (b.physical_progress_pct || 0) - (a.physical_progress_pct || 0);
    if (sortBy === 'DATE_DESC') return new Date(b.approval_date || 0) - new Date(a.approval_date || 0);
    return 0;
  });

  // Calculate totals
  const totalSanctionedSum = filtered.reduce((acc, p) => acc + (p.sanctioned_cost || 0), 0);
  const totalSpentSum = filtered.reduce((acc, p) => acc + (p.spent_cost || 0), 0);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Work ID', 'Title', 'Sector', 'Constituency', 'Recommender', 'Implementing Dept', 'Sanctioned Cost (INR)', 'Spent Cost (INR)', 'Progress %', 'Status', 'Proof Status'];
    const rows = filtered.map(p => [
      `"${p.source_work_id || ''}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${p.sector || ''}"`,
      `"${p.geo_name || ''}"`,
      `"${p.recommender_name || ''}"`,
      `"${p.implementing_dept || ''}"`,
      p.sanctioned_cost || 0,
      p.spent_cost || 0,
      p.physical_progress_pct || 0,
      `"${p.status || ''}"`,
      `"${p.proof_status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pan_India_Public_Works_Registry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-[#0b132e] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>PAN-INDIA DIRECTORY OF PUBLIC WORKS</span>
            </div>
            
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All Works (CSV)</span>
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Verified Public Works & Capital Outlays
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Real-time audit registry of all developmental initiatives recommended under MPLADS, MLALADS, and Panchayati Raj grants across Indian constituencies.
            </p>
          </div>

          {/* Quick Aggregate Stats Strip */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400">Total Filtered Works:</span> <strong className="text-white font-bold text-sm ml-1">{filtered.length}</strong>
            </div>
            <div>
              <span className="text-slate-400">Total Sanctioned:</span> <strong className="text-indigo-300 font-bold text-sm ml-1">₹{(totalSanctionedSum / 10000000).toFixed(2)} Cr</strong>
            </div>
            <div>
              <span className="text-slate-400">Total Expended:</span> <strong className="text-emerald-400 font-bold text-sm ml-1">₹{(totalSpentSum / 10000000).toFixed(2)} Cr</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by initiative title, constituency, MP/MLA name, or department..."
              className="w-full bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
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
            className="bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="COST_DESC">Sort: Highest Cost (₹)</option>
            <option value="PROGRESS_DESC">Sort: Physical Progress %</option>
            <option value="DATE_DESC">Sort: Recently Approved</option>
          </select>
        </div>

        {/* Sector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Sector:</span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                sectorFilter === sec
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {sec === 'ALL' ? 'All Sectors' : sec}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-slate-50 rounded-2xl p-12 text-center text-slate-500 space-y-2 border border-dashed border-slate-200">
            <p className="font-semibold text-slate-700">No public works match the selected criteria.</p>
            <p className="text-xs">Try selecting 'All Sectors' or clearing the search query.</p>
          </div>
        ) : (
          filtered.map(proj => {
            const isVerified = proj.proof_status === 'OFFICIAL_PROOF_VERIFIED';
            const isCitizen = proj.proof_status === 'CITIZEN_PROOF_ATTACHED';

            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className="bg-white hover:bg-slate-50/80 p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-indigo-600 font-semibold">{proj.sector}</span>
                        <span>·</span>
                        <span>{proj.source_work_id}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        {proj.title}
                      </h3>
                    </div>

                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono shrink-0 ${
                      proj.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      proj.status === 'UNDERWAY' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  {/* Representative & Jurisdiction */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{proj.geo_name || 'Constituency Work'}</span>
                    </div>
                    <span>·</span>
                    <span>Recommender: <strong className="text-slate-800">{proj.recommender_name || 'Official Authority'}</strong></span>
                  </div>

                  {/* Verification Status Badge */}
                  <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                    isVerified ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                    isCitizen ? 'bg-amber-50 text-amber-800 border-amber-100' :
                    'bg-rose-50 text-rose-800 border-rose-100'
                  }`}>
                    {isVerified ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : isCitizen ? (
                      <Camera className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    )}
                    <span className="truncate text-[11px] font-mono font-medium">
                      {isVerified ? 'Official Proof Verified' : isCitizen ? 'Citizen Evidence Attached' : 'Unverified (No proof uploaded)'}
                    </span>
                  </div>
                </div>

                {/* Progress and Financials */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Physical Progress: <strong className="text-slate-800">{proj.physical_progress_pct}%</strong></span>
                    <div className="text-right">
                      <span className="text-slate-400 mr-1">Sanction:</span>
                      <strong className="text-slate-900 font-bold">₹{(proj.sanctioned_cost / 100000).toFixed(1)}L</strong>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isVerified ? 'bg-emerald-600' : isCitizen ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${proj.physical_progress_pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
