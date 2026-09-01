import React, { useState, useEffect } from 'react';
import { X, FileCheck, CheckCircle2, ShieldCheck, MapPin, ExternalLink, Camera, AlertCircle } from 'lucide-react';

export default function ProjectDetailModal({ projectId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetch(`/api/projects/${projectId}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  if (!projectId) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !data ? (
          <div className="p-12 text-center text-slate-400 font-mono">
            Loading Project Audit Trail...
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>WORK ID: {data.project.source_work_id}</span>
                <span>•</span>
                <span>{data.project.sector}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-100 mt-1">{data.project.title}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{data.project.geo_name} • Coordinates ({data.project.lat}, {data.project.lon})</span>
              </p>
            </div>

            {/* Financial Ledger (PRD Section 9) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">SANCTIONED COST</span>
                <span className="font-bold text-amber-400 text-sm">₹{data.project.sanctioned_cost.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">EXPENDED TO DATE</span>
                <span className="font-bold text-emerald-400 text-sm">₹{data.project.spent_cost.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">PHYSICAL PROGRESS</span>
                <span className="font-bold text-slate-100 text-sm">{data.project.physical_progress_pct}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">WORK STATUS</span>
                <span className="font-bold text-sky-400 text-sm">{data.project.status}</span>
              </div>
            </div>

            {/* Responsibility Tree */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Responsibility & Attribution Chain</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-amber-400 font-mono block">RECOMMENDER</span>
                  <span className="font-bold text-slate-200">{data.project.recommender_name || 'Elected Representative'}</span>
                  <span className="text-[10px] text-slate-500 block">MP / MLA Recommendation</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-sky-400 font-mono block">SANCTIONING BODY</span>
                  <span className="font-bold text-slate-200">District Magistrate / Authority</span>
                  <span className="text-[10px] text-slate-500 block">Administrative Sanction</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-mono block">IMPLEMENTING DEPT</span>
                  <span className="font-bold text-slate-200">{data.project.implementing_dept}</span>
                  <span className="text-[10px] text-slate-500 block">Execution Authority</span>
                </div>
              </div>
            </div>

            {/* CPPP Contract Details */}
            {data.contracts && data.contracts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">CPPP e-Procurement Contract</h4>
                {data.contracts.map(c => (
                  <div key={c.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sky-400 font-bold">Tender ID: {c.tender_id}</span>
                      <span className="text-emerald-400 font-bold">{c.status}</span>
                    </div>
                    <div className="text-slate-200">Awarded Contractor: <strong className="text-amber-400">{c.vendor_name}</strong></div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>Tender Value: ₹{c.tender_value.toLocaleString('en-IN')}</span>
                      <span>Award Value: ₹{c.award_value.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Citizen Ground Evidence */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-sky-400" />
                <span>Citizen Ground Evidence & Verification ({data.evidence.length})</span>
              </h4>

              {data.evidence.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.evidence.map(ev => (
                    <div key={ev.id} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden space-y-2">
                      <img src={ev.image_url} alt="Evidence" className="w-full h-36 object-cover" />
                      <div className="p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="text-slate-400">{ev.user_name}</span>
                          <span className="text-emerald-400">{ev.issue_type}</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{ev.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-500 font-mono">
                  No citizen evidence uploaded yet for this work.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
