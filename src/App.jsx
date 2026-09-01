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

import ProminentLeadersSection from './components/ProminentLeadersSection.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('area'); // 'area', 'projects', 'compare', 'methodology'
  const [selectedAreaId, setSelectedAreaId] = useState('geo-varanasi');
  const [selectedRepId, setSelectedRepId] = useState('rep-modi');
  const [selectedRepModalId, setSelectedRepModalId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [lang, setLang] = useState('en'); // 'en' or 'hi'

  const handleSelectArea = (areaId) => {
    setSelectedAreaId(areaId);
    setActiveTab('area');
    window.scrollTo({ top: 750, behavior: 'smooth' });
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
        {activeTab === 'area' && (
          <div className="space-y-8">
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
