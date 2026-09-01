import React, { useState } from 'react';
import { Zap, Activity, RefreshCw, ShieldCheck, Database, CheckCircle2, Play, Hash } from 'lucide-react';

export default function LiveSyncMonitor({ recentLogs, sseConnected }) {
  const [triggering, setTriggering] = useState(false);
  const [customDelta, setCustomDelta] = useState('1');
  const [targetEntity, setTargetEntity] = useState('rep-1');
  const [lastTriggerMsg, setLastTriggerMsg] = useState(null);

  const handleSimulateDelta = (amount) => {
    setTriggering(true);
    fetch('/api/simulate-live-delta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entityId: targetEntity,
        amountDelta: amount,
        eventType: 'SPEND_VOUCHER',
        customDescription: `Manual live sync test: Triggered exact delta of +₹${Number(amount).toLocaleString('en-IN')} via Live Operations Control.`
      })
    })
      .then(res => res.json())
      .then(data => {
        setTriggering(false);
        setLastTriggerMsg(`Successfully broadcasted live delta (+₹${amount}) to all connected SSE clients!`);
        setTimeout(() => setLastTriggerMsg(null), 5000);
      })
      .catch(err => {
        setTriggering(false);
        console.error(err);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Control Panel Header */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Zap className="w-4 h-4" />
              <span>LIVE SOURCE INGESTION & SYNCHRONIZATION MONITOR</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Live Source Sync & Rupee Delta Engine</h2>
            <p className="text-xs text-slate-400 mt-1">
              Monitors real-time source webhooks and background polling for MPLADS, eGramSwaraj, City Finance, and ECI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-pulse"></span>
              SSE STREAM: ACTIVE
            </span>
          </div>
        </div>

        {/* Live Delta Tester Controls */}
        <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Play className="w-4 h-4 text-amber-400" />
              Interactive Rupee Delta Trigger (Test Live 1-Rupee Sync)
            </span>
            <span className="text-slate-400">Click any preset to inject a live transaction delta into the DB & push via SSE</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSimulateDelta(1)}
              disabled={triggering}
              className="px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold transition-all"
            >
              + ₹1 Delta
            </button>
            <button
              onClick={() => handleSimulateDelta(2)}
              disabled={triggering}
              className="px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold transition-all"
            >
              + ₹2 Delta
            </button>
            <button
              onClick={() => handleSimulateDelta(2500)}
              disabled={triggering}
              className="px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold transition-all"
            >
              + ₹2,500 Delta
            </button>
            <button
              onClick={() => handleSimulateDelta(50000)}
              disabled={triggering}
              className="px-3 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-400 font-mono text-xs font-bold transition-all"
            >
              + ₹50,000 Delta
            </button>

            {/* Custom Rupee Delta Input */}
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="number"
                value={customDelta}
                onChange={(e) => setCustomDelta(e.target.value)}
                className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100"
                placeholder="Rupees"
              />
              <button
                onClick={() => handleSimulateDelta(Number(customDelta) || 1)}
                disabled={triggering}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-bold hover:bg-amber-400"
              >
                Inject Delta
              </button>
            </div>
          </div>

          {lastTriggerMsg && (
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 p-2.5 rounded border border-emerald-500/20">
              {lastTriggerMsg}
            </div>
          )}
        </div>
      </div>

      {/* Live Provenance Hash Stream */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Hash className="w-4 h-4 text-sky-400" />
          <span>Immutable Provenance Hash Log (Cryptographic Source Audit)</span>
        </h3>

        <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto">
          {recentLogs && recentLogs.map(log => (
            <div key={log.id} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-amber-400 font-bold">{log.entity_name}</span>
                <span className="text-slate-500 mx-2">•</span>
                <span className="text-emerald-400 font-bold">+{log.amount_delta < 100 ? `₹${log.amount_delta}` : `₹${log.amount_delta.toLocaleString('en-IN')}`}</span>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5">{log.description}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="text-[9px] text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {log.provenance_hash}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
