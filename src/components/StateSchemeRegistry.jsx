import React, { useState, useEffect } from 'react';
import { Layers, Landmark, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function StateSchemeRegistry() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/state-schemes')
      .then(res => res.json())
      .then(data => {
        setSchemes(data || []);
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
        Loading State Scheme Registry...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <Layers className="w-4 h-4" />
          <span>PRD SECTION 11.2 • CONFIGURABLE STATE SCHEME REGISTRY</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100">State Scheme Registry (MLALAD Frameworks)</h2>
        <p className="text-xs text-slate-400">
          Unlike MPLADS which is federally uniform, state MLA LAD funds vary significantly by state design, annual ceilings, approval channels, and audit mechanisms. This registry models each state's statutory schema.
        </p>
      </div>

      {/* Grid of State Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map(sch => (
          <div key={sch.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
                  {sch.state_name}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-1">{sch.scheme_name}</h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-500 block uppercase">Annual Entitlement</span>
                <span className="text-base font-extrabold text-emerald-400">
                  ₹{(sch.annual_entitlement / 10000000).toFixed(2)} Cr
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono pt-3 border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Approval Chain</span>
                <span className="text-slate-200 font-sans text-xs">{sch.approval_chain}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Implementing Authority</span>
                <span className="text-amber-300 font-sans text-xs">{sch.implementing_authority}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Eligible Works</span>
                <span className="text-slate-300 font-sans text-xs">{sch.eligible_works}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Audit & Assurance Mechanism</span>
                <span className="text-sky-400 font-sans text-xs">{sch.audit_mechanism}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <a
                href={sch.portal_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1.5"
              >
                <span>State Portal Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Schema
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
