import React from 'react';
import { Landmark } from 'lucide-react';

export default function CleanHeader({ activeTab, setActiveTab, lang, setLang }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('area')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            जन
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base leading-tight tracking-tight">
              Jan Nigrani
            </div>
            <div className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
              PUBLIC ACCOUNTABILITY PLATFORM
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('area')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'area' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
            }`}
          >
            {lang === 'hi' ? 'आपका क्षेत्र' : 'Your area'}
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'projects' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
            }`}
          >
            {lang === 'hi' ? 'परियोजनाएं' : 'Projects'}
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'compare' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
            }`}
          >
            {lang === 'hi' ? 'तुलना' : 'Compare'}
          </button>

          <button
            onClick={() => setActiveTab('methodology')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'methodology' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
            }`}
          >
            {lang === 'hi' ? 'पद्धति एवं स्रोत' : 'Methodology'}
          </button>
        </nav>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(l => (l === 'en' ? 'hi' : 'en'))}
          className="text-xs font-mono font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
        >
          {lang === 'en' ? 'हि / EN' : 'EN / हि'}
        </button>
      </div>
    </header>
  );
}
