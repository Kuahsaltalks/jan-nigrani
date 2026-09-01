import React, { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, TrendingUp, CheckCircle2, Clock, AlertTriangle, ShieldCheck, FileText, ChevronRight, Zap, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AreaDashboard({ areaId = 'geo-1', onSelectRep, onSelectProject, recentLogs }) {
  const [areaData, setAreaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/areas/${areaId}`)
      .then(res => res.json())
      .then(data => {
        setAreaData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load area data:", err);
        setLoading(false);
      });
  }, [areaId]);

  if (loading || !areaData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-sm">Loading Public Accountability Graph for {areaId}...</p>
      </div>
    );
  }

  const { geography, representatives, fund_ledgers, projects } = areaData;

  // Calculate 5-Account Summary across all funds
  const totalEntitled = fund_ledgers.reduce((acc, l) => acc + (l.entitled_amount || 0), 0);
  const totalAllocated = fund_ledgers.reduce((acc, l) => acc + (l.allocated_amount || 0), 0);
  const totalReleased = fund_ledgers.reduce((acc, l) => acc + (l.released_amount || 0), 0);
  const totalSanctioned = fund_ledgers.reduce((acc, l) => acc + (l.sanctioned_amount || 0), 0);
  const totalExpended = fund_ledgers.reduce((acc, l) => acc + (l.expended_amount || 0), 0);
  const totalUnspent = fund_ledgers.reduce((acc, l) => acc + (l.unspent_balance || 0), 0);

  // Chart data
  const chartData = [
    { name: 'Entitled', amount: totalEntitled, color: '#64748b' },
    { name: 'Allocated', amount: totalAllocated, color: '#3b82f6' },
    { name: 'Released', amount: totalReleased, color: '#0284c7' },
    { name: 'Sanctioned', amount: totalSanctioned, color: '#d97706' },
    { name: 'Expended (Spent)', amount: totalExpended, color: '#10b981' },
    { name: 'Unspent', amount: totalUnspent, color: '#ef4444' }
  ];

  // Project status count
  const completedCount = projects.filter(p => p.status === 'COMPLETED').length;
  const underwayCount = projects.filter(p => p.status === 'UNDERWAY').length;
  const stalledCount = projects.filter(p => p.status === 'STALLED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Area Identity & Governance Crosswalk Header */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Landmark className="w-48 h-48 text-slate-100" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-semibold border border-amber-500/30">
                  LGD CODE: {geography.lgd_code}
                </span>
                <span className="text-slate-400 text-xs font-mono">{geography.state_name} STATE</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-100 mt-1">{geography.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{geography.type.replace('_', ' ')} • Multi-level Administrative & Electoral Jurisdiction</p>
            </div>

            {/* Coverage & Source Freshness Gauge */}
            <div className="flex items-center gap-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">DATA COVERAGE</div>
                <div className="text-lg font-extrabold text-emerald-400">96.5%</div>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">SOURCE FRESHNESS</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-200 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse"></span>
                  Live Sync (Continuous)
                </div>
              </div>
            </div>
          </div>

          {/* Overlapping Representatives Crosswalk */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">Overlapping Elected Institutions & Representatives</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {representatives.map(rep => (
                <div
                  key={rep.id}
                  onClick={() => onSelectRep(rep.id)}
                  className="bg-slate-900/80 hover:bg-slate-800 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer flex items-center gap-3"
                >
                  <img src={rep.photo_url} alt={rep.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-100 text-xs truncate">{rep.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{rep.office_title}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{rep.party}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5-Account Financial Ledger Section (PRD Section 6) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>5-Account Public Money Ledger</span>
            <span className="text-xs font-mono font-normal text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              Tracked Down to ₹1 Precision
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">FY 2025-26 Public Fund Streams</span>
        </div>

        {/* 5 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">1. Entitled</div>
            <div className="text-lg font-bold text-slate-300 mt-1">₹{(totalEntitled / 10000000).toFixed(2)} Cr</div>
            <div className="text-[10px] text-slate-500 mt-1">Total Eligibility</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">2. Allocated</div>
            <div className="text-lg font-bold text-blue-400 mt-1">₹{(totalAllocated / 10000000).toFixed(2)} Cr</div>
            <div className="text-[10px] text-slate-500 mt-1">Budget Assigned</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">3. Released</div>
            <div className="text-lg font-bold text-sky-400 mt-1">₹{(totalReleased / 10000000).toFixed(2)} Cr</div>
            <div className="text-[10px] text-slate-500 mt-1">Tranches Transferred</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/50 bg-amber-950/10">
            <div className="text-[10px] font-mono text-amber-400 uppercase">4. Sanctioned</div>
            <div className="text-lg font-bold text-amber-400 mt-1">
              ₹{totalSanctioned.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-amber-500/80 mt-1">Approved Works</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/50 bg-emerald-950/10">
            <div className="text-[10px] font-mono text-emerald-400 uppercase">5. Spent (Expended)</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              ₹{totalExpended.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-500/80 mt-1">Financial Progress</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/30 bg-rose-950/10">
            <div className="text-[10px] font-mono text-rose-400 uppercase">Unspent Balance</div>
            <div className="text-lg font-bold text-rose-400 mt-1">
              ₹{totalUnspent.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-rose-500/80 mt-1">Available Funds</div>
          </div>
        </div>

        {/* Ledger Visual Chart */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Fund Stream Visual Execution Breakdown</span>
            <span>MPLADS + MLALAD + eGramSwaraj + City Finance</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Development Projects & Real-time Live Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Public Development Projects ({projects.length})</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">{completedCount} Completed</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">{underwayCount} Underway</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono">{stalledCount} Stalled</span>
            </div>
          </div>

          <div className="space-y-3">
            {projects.map(proj => (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className="bg-slate-950 hover:bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>WORK ID: {proj.source_work_id}</span>
                      <span>•</span>
                      <span className="text-amber-400">{proj.sector}</span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm mt-0.5">{proj.title}</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold shrink-0 ${
                    proj.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    proj.status === 'UNDERWAY' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block">SANCTIONED COST</span>
                    <span className="font-bold text-slate-300">₹{proj.sanctioned_cost.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">EXPENDED</span>
                    <span className="font-bold text-emerald-400">₹{proj.spent_cost.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">PHYSICAL PROGRESS</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${proj.physical_progress_pct}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">{proj.physical_progress_pct}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">IMPLEMENTED BY</span>
                    <span className="text-[10px] text-slate-300 truncate block">{proj.implementing_dept}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Change Activity Feed (1 Column) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Live Delta Ticker</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              ₹1 Precision Stream
            </span>
          </div>

          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 max-h-[500px] overflow-y-auto">
            {recentLogs && recentLogs.length > 0 ? (
              recentLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-amber-400">{log.event_type}</span>
                  </div>
                  <div className="font-bold text-slate-200">{log.entity_name}</div>
                  <p className="text-slate-300 text-[11px] font-sans">{log.description}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                    <span className="text-emerald-400 font-bold">Delta: +₹{log.amount_delta.toLocaleString('en-IN')}</span>
                    <span className="text-slate-500 truncate max-w-[120px]">{log.provenance_hash.slice(0, 12)}...</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs font-mono">
                Listening for real-time live source deltas...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
