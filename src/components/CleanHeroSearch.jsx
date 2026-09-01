import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Users, Building, ArrowRight } from 'lucide-react';

export default function CleanHeroSearch({ onSelectArea, onSelectRep, onSelectProject, coverage = 82, lang }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setIsOpen(true);
        })
        .catch(console.error);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (results && results.geographies.length > 0) {
      onSelectArea(results.geographies[0].id);
      setIsOpen(false);
    } else if (results && results.persons.length > 0) {
      onSelectRep(results.persons[0].id);
      setIsOpen(false);
    }
  };

  const sampleChips = [
    { label: 'Narendra Modi (Varanasi)', repId: 'rep-modi' },
    { label: 'Rahul Gandhi (Rae Bareli)', repId: 'rep-rahul-gandhi' },
    { label: 'Amit Shah (Gandhinagar)', repId: 'rep-amit-shah' },
    { label: 'Sonia Gandhi', repId: 'rep-sonia-gandhi' },
    { label: 'Nitin Gadkari (Nagpur)', repId: 'rep-nitin-gadkari' },
    { label: 'Choti Ramdi (Kadkariya GP)', id: 'geo-chhoti-ramdi' },
    { label: 'Wayanad (Priyanka Gandhi)', repId: 'rep-priyanka-gandhi' },
    { label: 'Shashi Tharoor (TVM)', repId: 'rep-shashi-tharoor' },
    { label: 'Haldwani', id: 'geo-nainital' },
    { label: 'Amritsar', id: 'rag-2-amritsar' },
    { label: 'Baramati (Supriya Sule)', repId: 'rep-supriya-sule' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-6">
      <div className="bg-[#0b132e] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
        {/* Subtle curved background overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-transparent to-purple-950/20 pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          {/* Top Row: Data Coverage Meter */}
          <div className="flex justify-end">
            <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
              Data coverage <span className="text-emerald-400 font-bold">{coverage}%</span>
            </span>
          </div>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto space-y-3" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === 'hi' ? 'ग्राम सभा, शहर/मेयर, सांसद/विधायक या परियोजना खोजें (उदा: Choti Ramdi, Haldwani)...' : 'Search any Gram Sabha, Mayor, MP/MLA, or project (e.g. Choti Ramdi, Haldwani, Wayanad)...'}
                className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-2xl pl-5 pr-28 py-4 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all font-sans"
              />
              <button
                type="submit"
                className="absolute right-2 bg-[#5452f6] hover:bg-[#4340eb] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm sm:text-base flex items-center gap-1.5 shadow-md"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {isOpen && results && (
              <div className="absolute left-0 right-0 max-w-3xl mx-auto mt-2 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {results.geographies.length > 0 && (
                  <div className="p-3">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                      Places & Constituencies (All India)
                    </div>
                    {results.geographies.map(g => (
                      <div
                        key={g.id}
                        onClick={() => { onSelectArea(g.id); setIsOpen(false); setQuery(''); }}
                        className="px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="font-medium text-slate-900 text-sm">{g.name}</span>
                          <span className="text-xs text-slate-400">({g.state_name})</span>
                        </div>
                        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
                          {g.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {results.persons.length > 0 && (
                  <div className="p-3">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                      Elected Representatives (MPs / MLAs)
                    </div>
                    {results.persons.map(p => (
                      <div
                        key={p.id}
                        onClick={() => { onSelectRep(p.id); setIsOpen(false); setQuery(''); }}
                        className="px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{p.name}</div>
                            <div className="text-xs text-slate-400">{p.office_title}</div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600">{p.party}</span>
                      </div>
                    ))}
                  </div>
                )}

                {results.projects.length > 0 && (
                  <div className="p-3">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                      Public Works & Projects
                    </div>
                    {results.projects.map(proj => (
                      <div
                        key={proj.id}
                        onClick={() => { onSelectProject(proj.id); setIsOpen(false); setQuery(''); }}
                        className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-medium text-slate-800"
                      >
                        <div className="font-semibold">{proj.title}</div>
                        <div className="text-[11px] text-slate-400">{proj.sector} • ₹{proj.sanctioned_cost.toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Helper Suggestions underneath search */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
              <span>Try:</span>
              {sampleChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (chip.repId) {
                      onSelectRep(chip.repId);
                    } else if (chip.id) {
                      onSelectArea(chip.id);
                    }
                  }}
                  className="text-slate-300 hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  {chip.label}{idx < sampleChips.length - 1 ? ',' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
