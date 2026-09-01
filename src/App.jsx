import React, { useState, useEffect } from 'react';
import LiveHeader from './components/LiveHeader.jsx';
import AreaDashboard from './components/AreaDashboard.jsx';
import MoneyTrailViewer from './components/MoneyTrailViewer.jsx';
import RepresentativeProfile from './components/RepresentativeProfile.jsx';
import ResponsibleResolver from './components/ResponsibleResolver.jsx';
import StateSchemeRegistry from './components/StateSchemeRegistry.jsx';
import CompareEngine from './components/CompareEngine.jsx';
import InteractiveMap from './components/InteractiveMap.jsx';
import LiveSyncMonitor from './components/LiveSyncMonitor.jsx';
import CitizenEvidenceDesk from './components/CitizenEvidenceDesk.jsx';
import ProjectDetailModal from './components/ProjectDetailModal.jsx';
import { Zap, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('control-room');
  const [selectedAreaId, setSelectedAreaId] = useState('geo-1');
  const [selectedRepId, setSelectedRepId] = useState('rep-1');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [sseConnected, setSseConnected] = useState(false);
  const [liveToast, setLiveToast] = useState(null);

  // Fetch initial activity logs
  useEffect(() => {
    fetch('/api/live-logs')
      .then(res => res.json())
      .then(data => setRecentLogs(data || []))
      .catch(console.error);
  }, []);

  // Connect to Real-time SSE Live Event Stream
  useEffect(() => {
    const eventSource = new EventSource('/api/live-stream');

    eventSource.onopen = () => {
      console.log('[SSE] Connected to Jan Nigrani Live Source Stream!');
      setSseConnected(true);
    };

    eventSource.addEventListener('live-delta', (e) => {
      try {
        const payload = JSON.parse(e.data);
        console.log('[SSE EVENT RECEIVED]', payload);
        setRecentLogs(prev => [payload, ...prev.slice(0, 29)]);

        // Show live popup toast in bottom-right corner
        setLiveToast(payload);
        setTimeout(() => {
          setLiveToast(current => (current && current.id === payload.id ? null : current));
        }, 6000);
      } catch (err) {
        console.error('[SSE Error parsing data]', err);
      }
    });

    eventSource.onerror = (err) => {
      console.error('[SSE Connection Error]', err);
      setSseConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Periodic polling fallback to guarantee real-time updates even if SSE closes in serverless environments
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetch('/api/live-logs')
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setRecentLogs(prev => {
              if (prev.length > 0 && data[0].id !== prev[0].id) {
                setLiveToast(data[0]);
                setTimeout(() => setLiveToast(null), 6000);
              }
              return data;
            });
          }
        })
        .catch(() => {});
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleSelectArea = (areaId) => {
    setSelectedAreaId(areaId);
    setActiveTab('control-room');
  };

  const handleSelectRep = (repId) => {
    setSelectedRepId(repId);
    setActiveTab('representatives');
  };

  const handleSelectProject = (projId) => {
    setSelectedProjectId(projId);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative">
      {/* Header */}
      <LiveHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectArea={handleSelectArea}
        onSelectRep={handleSelectRep}
        liveStatus={sseConnected}
        recentLogs={recentLogs}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-12">
        {activeTab === 'control-room' && (
          <AreaDashboard
            areaId={selectedAreaId}
            onSelectRep={handleSelectRep}
            onSelectProject={handleSelectProject}
            recentLogs={recentLogs}
          />
        )}

        {activeTab === 'money-trail' && (
          <MoneyTrailViewer
            onSelectProject={handleSelectProject}
          />
        )}

        {activeTab === 'representatives' && (
          <RepresentativeProfile
            repId={selectedRepId}
            onSelectProject={handleSelectProject}
          />
        )}

        {activeTab === 'responsible' && (
          <ResponsibleResolver />
        )}

        {activeTab === 'state-schemes' && (
          <StateSchemeRegistry />
        )}

        {activeTab === 'compare' && (
          <CompareEngine
            onSelectRep={handleSelectRep}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            onSelectProject={handleSelectProject}
          />
        )}

        {activeTab === 'citizen-desk' && (
          <CitizenEvidenceDesk />
        )}

        {activeTab === 'live-sync' && (
          <LiveSyncMonitor
            recentLogs={recentLogs}
            sseConnected={sseConnected}
          />
        )}
      </main>

      {/* Live Transaction Delta Toast Notification */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-slate-950 border border-emerald-500/50 p-4 rounded-2xl shadow-2xl z-50 animate-bounce space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>LIVE RUPEE DELTA RECEIVED</span>
            </span>
            <button
              onClick={() => setLiveToast(null)}
              className="text-slate-500 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-slate-100 font-bold">{liveToast.entity_name}</div>
          <div className="text-emerald-400 font-mono text-sm font-extrabold">
            +{liveToast.amount_delta < 100 ? `₹${liveToast.amount_delta}` : `₹${liveToast.amount_delta.toLocaleString('en-IN')}`}
          </div>
          <p className="text-[11px] text-slate-300 font-sans">{liveToast.description}</p>
        </div>
      )}

      {/* Footer with Citation Pack Export Button */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            Jan Nigrani • India Public Accountability Graph (PRD v0.1 Specification)
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/api/citation-pack?entityId=rep-1"
              download
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded border border-amber-400/30 transition-colors"
            >
              Export Citation Pack (JSON)
            </a>
            <span>Continuous Live Sync Active</span>
          </div>
        </div>
      </footer>

      {/* Project Audit Trail Modal */}
      {selectedProjectId && (
        <ProjectDetailModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}
