import React from 'react';
import { ShieldCheck, Database, Layers, ExternalLink, HelpCircle } from 'lucide-react';

export default function CleanMethodologyView() {
  const sources = [
    { name: 'MPLADS Dashboard', org: 'Ministry of Statistics & Programme Implementation', url: 'https://mplads.gov.in/', desc: 'Constituency fund releases, work recommendations, expenditure, and GIS asset maps.' },
    { name: 'Local Government Directory (LGD)', org: 'Ministry of Panchayati Raj', url: 'https://panchayat.gov.in/en/lgd/', desc: 'Unique spatial and administrative identifiers for all states, districts, ULBs, blocks, and Gram Panchayats.' },
    { name: 'eGramSwaraj', org: 'NIC & Ministry of Panchayati Raj', url: 'https://egramswaraj.gov.in/', desc: 'Gram Panchayat development plans (GPDP), physical progress, accounting vouchers, and PFMS reconciliation.' },
    { name: 'City Finance Portal', org: 'Ministry of Housing and Urban Affairs', url: 'https://www.cityfinance.in/', desc: 'Standardized municipal financial data, 15th Finance Commission urban grants, and service benchmarks.' },
    { name: 'Central Public Procurement Portal (CPPP)', org: 'NIC & Ministry of Finance', url: 'https://eprocure.gov.in/', desc: 'Tender notices, corrigenda, vendor awards, and contract financial values.' },
    { name: 'Comptroller & Auditor General (CAG)', org: 'CAG India', url: 'https://cag.gov.in/', desc: 'Local body compliance, financial irregularities, and public expenditure performance audits.' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 space-y-2">
        <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
          EDITORIAL INTEGRITY & PROVENANCE
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Methodology & Public Data Sources
        </h1>
        <p className="text-sm text-slate-500">
          Jan Nigrani connects fragmented government registers into a single, verifiable public accountability graph.
        </p>
      </div>

      {/* Core Principle: Attribution Separation */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Core Attribution Principle (PRD Section 5)</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Why "money spent in an area" is not "money spent by a politician"
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          India's constitutional and administrative architecture strictly divides public work into multiple distinct stages. An elected MP or MLA may <em>recommend</em> a project, while a District Magistrate or Urban Development Department <em>sanctions</em> it, an engineering wing <em>tenders</em> it, and an external contractor <em>executes</em> it.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Jan Nigrani labels every number with its exact statutory role badge—never collapsing complex public spending into a simplistic, misleading personal score.
        </p>
      </div>

      {/* Primary Data Registers */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Primary Government Data Registers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((s, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                <div className="text-xs text-indigo-600 font-medium">{s.org}</div>
                <p className="text-xs text-slate-500 mt-2">{s.desc}</p>
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-slate-600 hover:text-indigo-600 inline-flex items-center gap-1 pt-3 border-t border-slate-100 font-semibold"
              >
                <span>Official Source Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
