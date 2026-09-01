import React, { useState, useEffect } from 'react';
import { X, MapPin, ShieldCheck, FileCheck, ExternalLink } from 'lucide-react';

export default function CleanProjectModal({ projectId, onClose }) {
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
      .catch(console.error);
  }, [projectId]);

  if (!projectId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !data ? (
          <div className="py-20 text-center text-slate-400 font-mono text-xs">
            Loading Project Audit Record...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1.5 pr-8">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold">
                <span>{data.project.source_work_id}</span>
                <span>·</span>
                <span>{data.project.sector}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                {data.project.title}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.project.geo_name} ({data.project.lat}, {data.project.lon})</span>
              </p>
            </div>

            {/* Financial Status Summary */}
            <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">SANCTIONED</span>
                <span className="font-bold text-slate-900 text-sm">₹{data.project.sanctioned_cost.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EXPENDED</span>
                <span className="font-bold text-emerald-600 text-sm">₹{data.project.spent_cost.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PROGRESS</span>
                <span className="font-bold text-indigo-600 text-sm">{data.project.physical_progress_pct}%</span>
              </div>
            </div>

            {/* Responsibility Chain */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Responsibility Chain
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-purple-700 block font-semibold">RECOMMENDED BY</span>
                  <span className="font-bold text-slate-900">{data.project.recommender_name || 'Elected MP'}</span>
                  <span className="text-[10px] text-slate-400 block">MPLADS Recommendation</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-teal-700 block font-semibold">EXECUTED BY</span>
                  <span className="font-bold text-slate-900">{data.project.implementing_dept}</span>
                  <span className="text-[10px] text-slate-400 block">Implementing Agency</span>
                </div>
              </div>
            </div>

            {/* Source Reference */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Source: {data.project.source_name}</span>
              <a
                href={data.project.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Government Record</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
