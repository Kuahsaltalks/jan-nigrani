import React, { useState, useEffect } from 'react';
import { Search, Activity, Landmark, MapPin, Users, GitCommit, ShieldAlert, Camera, ArrowRight, Zap, HelpCircle, Layers } from 'lucide-react';

export default function LiveHeader({ activeTab, setActiveTab, onSelectArea, onSelectRep, liveStatus, recentLogs }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const latestLog = recentLogs && recentLogs.length > 0 ? recentLogs[0] : null;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner: Real-time Live Sync Indicator & Ticker */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse"></span>
            <span className="font-semibold tracking-wide uppercase text-[10px]">LIVE SOURCE STREAM</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Precision: <span className="text-amber-400 font-bold">₹1 Delta Sync</span> • Refresh: Continuous
          </span>
        </div>

        {/* Live Change Ticker */}
        {latestLog && (
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded border border-slate-800 max-w-xl truncate">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
            <span className="text-slate-400 shrink-0">Recent Delta:</span>
            <span className="text-emerald-400 font-bold shrink-0">
              +{latestLog.amount_delta < 100 ? `₹${latestLog.amount_delta}` : `₹${latestLog.amount_delta.toLocaleString('en-IN')}`}
            </span>
            <span className="text-slate-300 truncate">{latestLog.entity_name} — {latestLog.description}</span>
          </div>
        )}
      </div>

      {/* Main Bar: Title, Search, Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('control-room')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-100">JAN NIGRANI</h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">INDIA</span>
            </div>
            <p className="text-[11px] text-slate-400">Public Accountability & Development Graph</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search area (e.g. Varanasi), MP/MLA name, or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-slate-800">
              {searchResults.geographies.length > 0 && (
                <div className="p-2">
                  <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider">Geographies / Areas</div>
                  {searchResults.geographies.map(g => (
                    <div
                      key={g.id}
                      onClick={() => { onSelectArea(g.id); setSearchQuery(''); setSearchResults(null); }}
                      className="px-3 py-2 hover:bg-slate-800 rounded cursor-pointer flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-200">{g.name} <span className="text-slate-500 font-normal">({g.state_name})</span></span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">{g.type}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.persons.length > 0 && (
                <div className="p-2">
                  <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider">Representatives</div>
                  {searchResults.persons.map(p => (
                    <div
                      key={p.id}
                      onClick={() => { onSelectRep(p.id); setSearchQuery(''); setSearchResults(null); }}
                      className="px-3 py-2 hover:bg-slate-800 rounded cursor-pointer flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-200">{p.name} <span className="text-slate-500 font-normal">({p.office_title})</span></span>
                      <span className="text-[10px] text-emerald-400">{p.party}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('control-room')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'control-room' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Control Room</span>
          </button>

          <button
            onClick={() => setActiveTab('money-trail')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'money-trail' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Money Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('representatives')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'representatives' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Representatives</span>
          </button>

          <button
            onClick={() => setActiveTab('responsible')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'responsible' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Who's Responsible?</span>
          </button>

          <button
            onClick={() => setActiveTab('state-schemes')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'state-schemes' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>State Schemes</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'compare' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'map' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>GIS Map</span>
          </button>

          <button
            onClick={() => setActiveTab('citizen-desk')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'citizen-desk' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Citizen Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('live-sync')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'live-sync' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Live Monitor</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
