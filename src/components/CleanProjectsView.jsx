import React, { useState, useEffect } from 'react';
import { Filter, Search, ChevronRight, ExternalLink, MapPin } from 'lucide-react';

export default function CleanProjectsView({ onSelectProject, lang }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
        <p className="font-mono text-sm">Loading Pan-India Development Projects...</p>
      </div>
    );
  }

  const sectors = ['ALL', ...new Set(projects.map(p => p.sector))];

  const filtered = projects.filter(p => {
    const matchesSector = sectorFilter === 'ALL' || p.sector === sectorFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesQuery = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.geo_name && p.geo_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSector && matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 space-y-2">
        <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
          PAN-INDIA DIRECTORY
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Development Works & Sanctions
        </h1>
        <p className="text-sm text-slate-500">
          Audited infrastructure projects across Parliamentary & Assembly constituencies across India.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Sector:</span>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-medium text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-medium text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="UNDERWAY">Underway</option>
              <option value="STALLED">Stalled</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Showing <strong className="text-slate-900">{filtered.length}</strong> of {projects.length} works
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(proj => (
          <div
            key={proj.id}
            onClick={() => onSelectProject(proj.id)}
            className="bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-indigo-600 font-semibold">{proj.sector}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  proj.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  proj.status === 'UNDERWAY' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {proj.status}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {proj.title}
              </h3>

              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{proj.geo_name || 'India'} · Recommender: <strong className="text-slate-700">{proj.recommender_name || 'Elected MP'}</strong></span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">SANCTIONED</span>
                <span className="font-bold text-slate-900">₹{(proj.sanctioned_cost / 100000).toFixed(1)} Lakh</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">EXPENDED</span>
                <span className="font-bold text-emerald-600">₹{(proj.spent_cost / 100000).toFixed(1)} Lakh</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
