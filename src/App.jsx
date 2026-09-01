import React, { useState } from 'react';
import CleanHeader from './components/CleanHeader.jsx';
import CleanHeroSearch from './components/CleanHeroSearch.jsx';
import CleanAreaView from './components/CleanAreaView.jsx';
import CleanProjectsView from './components/CleanProjectsView.jsx';
import CleanCompareView from './components/CleanCompareView.jsx';
import CleanMethodologyView from './components/CleanMethodologyView.jsx';
import CleanProjectModal from './components/CleanProjectModal.jsx';
import CleanRepModal from './components/CleanRepModal.jsx';
import CleanFooter from './components/CleanFooter.jsx';

import JanNigraniRAGAssistant from './components/JanNigraniRAGAssistant.jsx';
import ProminentLeadersSection from './components/ProminentLeadersSection.jsx';
import ConstituencyTycoon from './components/ConstituencyTycoon.jsx';
import JanRathTrainMap from './components/JanRathTrainMap.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('train'); // Default to the visual train animation!
  const [selectedAreaId, setSelectedAreaId] = useState('geo-varanasi');
  const [selectedRepId, setSelectedRepId] = useState('rep-modi');
  const [selectedRepModalId, setSelectedRepModalId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [lang, setLang] = useState('en'); // 'en' or 'hi'

  const handleSelectArea = (areaId) => {
    setSelectedAreaId(areaId);
    setActiveTab('area');
    window.scrollTo({ top: 900, behavior: 'smooth' });
  };

  const handleSelectRep = (repId) => {
    setSelectedRepModalId(repId);
  };

  const handleSelectProject = (projId) => {
    setSelectedProjectId(projId);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Header */}
      <CleanHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
      />

      {/* 2. Hero Search Bar with Pan-India Constituency RAG Search */}
      <CleanHeroSearch
        onSelectArea={handleSelectArea}
        onSelectRep={handleSelectRep}
        onSelectProject={handleSelectProject}
        coverage={82}
        lang={lang}
      />

      {/* 3. Main Views */}
      <main className="flex-1 pb-16">
        {/* VIEW 1: THE JAN RATH FUND EXPRESS (DELHI TO CONSTITUENCY TRAIN MAP) */}
        {activeTab === 'train' && (
          <div className="space-y-6">
            <JanRathTrainMap
              onSelectConstituency={(constId) => {
                setSelectedAreaId(constId === 'haldwani' ? 'geo-chhoti-ramdi' : `geo-${constId}`);
              }}
            />

            {/* Quick Link to Tycoon Game */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div 
                onClick={() => setActiveTab('tycoon')}
                className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 p-5 sm:p-6 rounded-3xl text-white flex flex-wrap items-center justify-between gap-4 border border-indigo-500/30 shadow-xl cursor-pointer hover:border-indigo-400 transition-all group"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-800/60">
                    <span>🎮 ALSO PLAY</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                    Constituency Tycoon: Can You Outperform Your MP with ₹50 Crore?
                  </h3>
                  <p className="text-xs text-slate-300">
                    Construct solar plants, schools, and hospitals on a 16-ward city grid and battle your MP's official CAG audit!
                  </p>
                </div>

                <button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-md group-hover:scale-105 shrink-0">
                  <span>Play Simulator</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: GAMIFIED CONSTITUENCY TYCOON SIMULATOR */}
        {activeTab === 'tycoon' && (
          <ConstituencyTycoon
            onExitGame={() => setActiveTab('area')}
          />
        )}

        {activeTab === 'area' && (
          <div className="space-y-6">
            {/* Tycoon Quick Launch Teaser Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div 
                onClick={() => setActiveTab('tycoon')}
                className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 p-6 rounded-3xl text-white flex flex-wrap items-center justify-between gap-4 border border-indigo-500/30 shadow-xl cursor-pointer hover:border-indigo-400 transition-all group"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-800/60">
                    <span>🎮 INTERACTIVE GAME</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                    Constituency Tycoon: Can You Outperform Your MP with ₹50 Crore?
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Take command of Varanasi, Rae Bareli, Gandhinagar, or your local Gram Sabha. Construct real infrastructure, manage ₹50 Cr MoSPI funds, and battle your MP's actual record!
                  </p>
                </div>

                <button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-md group-hover:scale-105 shrink-0">
                  <span>Play Simulator Now</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            {/* Ask Jan Nigrani AI (Semantic RAG Assistant) */}
            <JanNigraniRAGAssistant
              onSelectRep={handleSelectRep}
              onSelectArea={handleSelectArea}
              onSelectProject={handleSelectProject}
            />

            {/* Prominent National Leaders (BJP & Congress) Grid */}
            <ProminentLeadersSection
              onSelectRep={handleSelectRep}
              lang={lang}
            />

            {/* Selected Area Public Accountability Dashboard */}
            <CleanAreaView
              areaId={selectedAreaId}
              onSelectRep={handleSelectRep}
              onSelectProject={handleSelectProject}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'projects' && (
          <CleanProjectsView
            onSelectProject={handleSelectProject}
            lang={lang}
          />
        )}

        {activeTab === 'compare' && (
          <CleanCompareView
            lang={lang}
          />
        )}

        {activeTab === 'methodology' && (
          <CleanMethodologyView
            lang={lang}
          />
        )}
      </main>

      {/* 4. Clean Government Data Source Footer & Provenance Notes */}
      <CleanFooter selectedRepId={selectedRepId} />

      {/* 5. Project Modal */}
      {selectedProjectId && (
        <CleanProjectModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {/* 6. Representative Detail Modal (Tenure, Works, Status) */}
      {selectedRepModalId && (
        <CleanRepModal
          repId={selectedRepModalId}
          onClose={() => setSelectedRepModalId(null)}
          onSelectProject={handleSelectProject}
        />
      )}
    </div>
  );
}
