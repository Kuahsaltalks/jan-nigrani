import React from 'react';
import { ExternalLink, ShieldCheck, Database, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function CleanFooter({ selectedRepId }) {
  const sources = [
    {
      name: 'MPLADS Official Portal',
      authority: 'Ministry of Statistics & Programme Implementation (MoSPI)',
      url: 'https://mplads.gov.in/',
      scope: 'Constituency fund entitlements (₹5 Cr/yr), work recommendations, sanctions, and GIS asset maps.'
    },
    {
      name: 'Local Government Directory (LGD)',
      authority: 'Ministry of Panchayati Raj (MoPR)',
      url: 'https://panchayat.gov.in/en/lgd/',
      scope: 'Unique statutory spine for Parliamentary (PC), Assembly (AC), ULB, and Gram Panchayat codes.'
    },
    {
      name: 'eGramSwaraj Portal',
      authority: 'Ministry of Panchayati Raj & NIC',
      url: 'https://egramswaraj.gov.in/',
      scope: 'Gram Panchayat GPDP plans, physical work verification, and PFMS financial vouchers down to ₹1.'
    },
    {
      name: 'City Finance Portal',
      authority: 'Ministry of Housing & Urban Affairs (MoHUA)',
      url: 'https://www.cityfinance.in/',
      scope: 'Standardized municipal balance sheets, 15th Finance Commission urban grants, and civic accounts.'
    },
    {
      name: 'Central Public Procurement Portal (CPPP)',
      authority: 'Department of Expenditure, Ministry of Finance',
      url: 'https://eprocure.gov.in/',
      scope: 'Tender notices, technical bids, vendor award values, and civil engineering work orders.'
    },
    {
      name: 'Comptroller & Auditor General (CAG)',
      authority: 'CAG of India',
      url: 'https://cag.gov.in/',
      scope: 'Statutory compliance audits, state financial audit reports, and local body expenditure scrutiny.'
    },
    {
      name: 'Election Commission of India (ECI)',
      authority: 'Election Commission of India',
      url: 'https://eci.gov.in/',
      scope: 'Electoral crosswalks, representative tenure records, and candidate affidavits.'
    },
    {
      name: 'CPGRAMS Grievance Portal',
      authority: 'Department of Administrative Reforms (DARPG)',
      url: 'https://pgportal.gov.in/',
      scope: 'Centralized Public Grievance Redress and civic accountability escalation channels.'
    }
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 font-sans mt-auto">
      {/* 1. Official Data Sources Register */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
            <Database className="w-4 h-4" />
            <span>Official Government Data Registers & Provenance</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-slate-900">
            Sources of Data & Verification Directory
          </h3>
          <p className="text-xs text-slate-500 max-w-3xl">
            Jan Nigrani aggregates and cross-verifies records from official statutory registries. Every financial figure, sanction order, and progress indicator is directly traceable to the government source portals listed below.
          </p>
        </div>

        {/* Source Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sources.map((source, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {source.name}
                  </h4>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                </div>
                <div className="text-[11px] font-medium text-indigo-600">
                  {source.authority}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  {source.scope}
                </p>
              </div>

              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-600 hover:text-indigo-800 hover:underline pt-2 border-t border-slate-100"
              >
                <span>Visit Source Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

        {/* 2. Editorial & Provenance Footnote */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Important Notes on Data Provenance & Precision (PRD Sections 5 & 6)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-800">1-Rupee Precision Guarantee:</strong> All financial entries (Entitled, Allocated, Released, Sanctioned, and Expended) are tracked down to the exact rupee from published government treasury and PFMS vouchers. No figures are estimated or simulated.
            </p>
            <p>
              <strong className="text-slate-800">Role Attribution Separation:</strong> Public works are labelled with their exact statutory role badge (<em>Direct Recommendation</em> vs <em>Implementing Authority</em>). Public expenditure in an area is never falsely attributed as an individual politician's personal spending.
            </p>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-900">Jan Nigrani</span>
            <span>·</span>
            <span>India Public Accountability Platform</span>
            <span>·</span>
            <span className="font-mono text-emerald-600 font-semibold">Continuous Live Sync Active</span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <a
              href={`/api/citation-pack?entityId=${selectedRepId || 'rep-modi'}`}
              download
              className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Citation Pack (JSON)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
