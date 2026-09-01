import React, { useState, useEffect } from 'react';
import { HelpCircle, ArrowRight, ShieldCheck, Landmark, Building, PhoneCall, ExternalLink, CheckCircle } from 'lucide-react';

export default function ResponsibleResolver() {
  const [resolvers, setResolvers] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/responsible-resolver')
      .then(res => res.json())
      .then(data => {
        setResolvers(data || []);
        if (data && data.length > 0) setSelectedIssueId(data[0].id);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 font-mono">
        Loading "Who is Responsible?" Resolver...
      </div>
    );
  }

  const current = resolvers.find(r => r.id === selectedIssueId) || resolvers[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <HelpCircle className="w-4 h-4" />
          <span>PRD HIGH-VALUE FEATURE • SECTION 34</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100">"Who is Responsible?" Resolver</h2>
        <p className="text-xs text-slate-400">
          Never guess who is accountable for a broken road, water crisis, clogged drain, or school building. This resolver maps the exact statutory chain: Recommender &rarr; Sanctioning Body &rarr; Implementing Department &rarr; Oversight Body.
        </p>

        {/* Issue Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {resolvers.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedIssueId(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedIssueId === r.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {r.issue_sector}
            </button>
          ))}
        </div>
      </div>

      {/* Accountability Chain Visualizer */}
      {current && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">PROBLEM INSTANCE</span>
            <h3 className="text-xl font-bold text-slate-100 mt-1">{current.problem_title}</h3>
            <p className="text-xs text-slate-400 mt-1">{current.guidance_notes}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1: Recommender */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                <span>STAGE 1: PROPOSAL</span>
                <Landmark className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] text-slate-400 uppercase font-mono">Recommending Actor</div>
              <div className="font-bold text-slate-100 text-sm">{current.recommender_role}</div>
              <p className="text-[11px] text-slate-400 font-sans">
                Elected official empowered to recommend priority works or raise zero-hour questions.
              </p>
            </div>

            {/* Step 2: Sanctioning Body */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between text-[10px] font-mono text-sky-400">
                <span>STAGE 2: SANCTION</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] text-slate-400 uppercase font-mono">Sanctioning Authority</div>
              <div className="font-bold text-slate-100 text-sm">{current.sanctioning_body}</div>
              <p className="text-[11px] text-slate-400 font-sans">
                Administrative officer holding financial sanction and technical approval power.
              </p>
            </div>

            {/* Step 3: Executing Dept */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                <span>STAGE 3: EXECUTION</span>
                <Building className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] text-slate-400 uppercase font-mono">Implementing Department</div>
              <div className="font-bold text-slate-100 text-sm">{current.executing_dept}</div>
              <p className="text-[11px] text-slate-400 font-sans">
                Engineering wing issuing tenders, overseeing contractor execution, and certifying physical progress.
              </p>
            </div>

            {/* Step 4: Oversight & Grievance */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between text-[10px] font-mono text-rose-400">
                <span>STAGE 4: ESCALATION</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] text-slate-400 uppercase font-mono">Oversight & Redressal</div>
              <div className="font-bold text-slate-100 text-sm">{current.oversight_institution}</div>
              <p className="text-[11px] text-slate-400 font-sans">
                Statutory audit body + Central CPGRAMS Portal.
              </p>
              <a
                href="https://pgportal.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:underline pt-1"
              >
                <span>CPGRAMS Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
