import React, { useState, useEffect } from 'react';
import CleanHeader from './components/CleanHeader.jsx';
import CleanHeroSearch from './components/CleanHeroSearch.jsx';
import CleanAreaView from './components/CleanAreaView.jsx';
import CleanProjectsView from './components/CleanProjectsView.jsx';
import CleanCompareView from './components/CleanCompareView.jsx';
import CleanMethodologyView from './components/CleanMethodologyView.jsx';
import CleanProjectModal from './components/CleanProjectModal.jsx';
import CleanFooter from './components/CleanFooter.jsx';
import { Zap, X, Download } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('area'); // 'area', 'projects', 'compare', 'methodology'
  const [selectedAreaId, setSelectedAreaId] = useState('geo-varanasi');
  const [selectedRepId, setSelectedRepId] = useState('rep-modi');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [liveToast, setLiveToast] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);

  // Connect to SSE Live Event Stream
  useEffect(() => {
    const eventSource = new EventSource('/api/live-stream');

    eventSource.addEventListener('live-delta', (e) => {
      try {
        const payload = JSON.parse(e.data);
        setRecentLogs(prev => [payload, ...prev.slice(0, 19)]);
        setLiveToast(payload);
        setTimeout(() => {
          setLiveToast(current => (current && current.id === payload.id ? null : current));
        }, 5000);
      } catch (err) {
        console.error('[SSE Parse Error]', err);
      }
    });

    return () => eventSource.close();
  }, []);

  // Polling fallback
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetch('/api/live-logs')
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setRecentLogs(prev => {
              if (prev.length > 0 && data[0].id !== prev[0].id) {
                setLiveToast(data[0]);
                setTimeout(() => setLiveToast(null), 5000);
              }
              return data;
            });
          }
        })
        .catch(() => {});
    }, 6000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleSelectArea = (areaId) => {
    setSelectedAreaId(areaId);
    setActiveTab('area');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleSelectRep = (repId) => {
    setSelectedRepId(repId);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* 2. Hero Search Bar */}
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
          <CleanAreaView
            areaId={selectedAreaId}
            onSelectRep={handleSelectRep}
            onSelectProject={handleSelectProject}
            lang={lang}
          />
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

      {/* 4. Live Delta Notification Toast */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 z-50 animate-fade-in flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot"></span>
              <span>LIVE SOURCE UPDATE</span>
            </div>
            <div className="text-sm font-bold text-slate-100 truncate">{liveToast.entity_name}</div>
            <p className="text-xs text-slate-300 font-sans">{liveToast.description}</p>
          </div>
          <button
            onClick={() => setLiveToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Clean Government Data Source Footer & Provenance Notes */}
      <CleanFooter selectedRepId={selectedRepId} />

      {/* 6. Project Modal */}
      {selectedProjectId && (
        <CleanProjectModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}
