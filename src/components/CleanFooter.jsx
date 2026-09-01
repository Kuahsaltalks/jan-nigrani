import React from 'react';
import { ExternalLink, Download } from 'lucide-react';

export default function CleanFooter({ selectedRepId }) {
  const sources = [
    { num: '1', name: 'MPLADS (MoSPI)', url: 'https://mplads.gov.in/' },
    { num: '2', name: 'LGD (MoPR)', url: 'https://panchayat.gov.in/en/lgd/' },
    { num: '3', name: 'eGramSwaraj', url: 'https://egramswaraj.gov.in/' },
    { num: '4', name: 'CityFinance', url: 'https://www.cityfinance.in/' },
    { num: '5', name: 'CPPP Tenders', url: 'https://eprocure.gov.in/' },
    { num: '6', name: 'CAG Audit', url: 'https://cag.gov.in/' },
    { num: '7', name: 'ECI', url: 'https://eci.gov.in/' },
    { num: '8', name: 'CPGRAMS', url: 'https://pgportal.gov.in/' }
  ];

  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
        {/* Concise Data Note */}
        <div className="text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-700 font-semibold">Data Note:</strong> All financial entries and physical progress indicators are ingested directly from official government records with ₹1 precision. Role attribution strictly separates legislative recommendations from executive department execution.
        </div>

        {/* Numbered Sources in compact inline list */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs pt-1 border-t border-slate-100 font-mono">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Sources:</span>
          {sources.map((s, idx) => (
            <React.Fragment key={s.num}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-indigo-600 hover:underline transition-colors inline-flex items-center gap-0.5"
              >
                <span className="text-slate-400 font-semibold">[{s.num}]</span>
                <span>{s.name}</span>
              </a>
              {idx < sources.length - 1 && <span className="text-slate-300">·</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom Bar with Platform Info & Citation Pack */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Jan Nigrani</span>
            <span>·</span>
            <span>India Public Accountability Platform</span>
            <span>·</span>
            <span className="text-emerald-600 font-mono font-semibold">Continuous Live Sync Active</span>
          </div>

          <a
            href={`/api/citation-pack?entityId=${selectedRepId || 'rep-modi'}`}
            download
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold font-mono"
          >
            <Download className="w-3 h-3" />
            <span>Export Citation Pack (JSON)</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
