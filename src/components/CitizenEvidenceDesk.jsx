import React, { useState, useEffect } from 'react';
import { Camera, Send, CheckCircle2, AlertCircle, ShieldCheck, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';

export default function CitizenEvidenceDesk() {
  const [activeSubTab, setActiveSubTab] = useState('submit'); // 'submit' or 'moderation'
  const [userName, setUserName] = useState('');
  const [projectId, setProjectId] = useState('proj-1');
  const [issueType, setIssueType] = useState('COMPLETED_VERIFIED');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [evidenceList, setEvidenceList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const fetchEvidenceList = () => {
    setLoadingList(true);
    fetch('/api/citizen-evidence')
      .then(res => res.json())
      .then(data => {
        setEvidenceList(data || []);
        setLoadingList(false);
      })
      .catch(() => setLoadingList(false));
  };

  useEffect(() => {
    if (activeSubTab === 'moderation') {
      fetchEvidenceList();
    }
  }, [activeSubTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) return;

    fetch('/api/citizen-evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        userName,
        issueType,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
        lat: 25.32,
        lon: 82.98
      })
    })
      .then(res => res.json())
      .then(() => {
        setSubmitted(true);
        setDescription('');
        setTimeout(() => setSubmitted(false), 4000);
      });
  };

  const handleModerate = (id, newStatus) => {
    fetch(`/api/citizen-evidence/${id}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(() => {
        setEvidenceList(prev => prev.map(item => item.id === id ? { ...item, moderation_status: newStatus } : item));
      });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('submit')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeSubTab === 'submit' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Submit Ground Verification
          </button>
          <button
            onClick={() => setActiveSubTab('moderation')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeSubTab === 'moderation' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Evidence Moderation Queue
          </button>
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:inline">PRD SECTION 16</span>
      </div>

      {activeSubTab === 'submit' ? (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Camera className="w-4 h-4" />
              <span>GROUND EVIDENTIARY CONTRIBUTION MODEL</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Submit Citizen Ground Evidence</h2>
            <p className="text-xs text-slate-400 mt-1">
              Citizens and journalists can upload timestamped geotagged photos or report incomplete works. Submissions are presented as an independent evidence layer without modifying government records.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Evidence submitted successfully! Sent to public moderation queue.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Your Name / Organization:</label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Kumar (Local Watchdog)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Report Category:</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-bold focus:outline-none"
                  >
                    <option value="COMPLETED_VERIFIED">Work Verified Completed (Photo attached)</option>
                    <option value="INCOMPLETE_WORK">Work Incomplete / Halted</option>
                    <option value="POOR_QUALITY">Substandard Material / Poor Quality</option>
                    <option value="WRONG_LOCATION">Incorrect Geotag Location</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ground Observation Description:</label>
                <textarea
                  rows={3}
                  placeholder="Describe ground reality (e.g., inspected site on 30 Aug 2026, foundation laid but work halted)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Photo URL (Geotagged Photo):</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ground Verification</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Moderation Queue */
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>COMMUNITY MODERATION & TRUST ENGINE</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Citizen Evidence Moderation Desk</h2>
            <p className="text-xs text-slate-400 mt-1">
              Review user-submitted evidence for authenticity, spam prevention, and compliance with editorial standards before publishing to public project audit trails.
            </p>
          </div>

          {loadingList ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Loading moderation queue...
            </div>
          ) : evidenceList.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              No evidence reports in the moderation queue.
            </div>
          ) : (
            <div className="space-y-4">
              {evidenceList.map(item => (
                <div key={item.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4 min-w-0 flex-1">
                    {item.image_url && (
                      <img src={item.image_url} alt="Evidence" className="w-24 h-24 rounded-lg object-cover border border-slate-700 shrink-0" />
                    )}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="font-bold text-amber-400">{item.user_name}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-sky-400 font-bold">{item.issue_type}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="font-bold text-sm text-slate-200">{item.project_title || 'Public Infrastructure Work'}</div>
                      <p className="text-xs text-slate-300 font-sans">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                      item.moderation_status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      item.moderation_status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.moderation_status}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleModerate(item.id, 'APPROVED')}
                        className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-mono font-bold rounded flex items-center gap-1"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerate(item.id, 'REJECTED')}
                        className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-mono font-bold rounded flex items-center gap-1"
                      >
                        <ThumbsDown className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
