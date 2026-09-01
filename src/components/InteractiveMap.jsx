import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ExternalLink, Layers, ShieldCheck } from 'lucide-react';

// Custom Leaflet Markers
const completedIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color:#10b981; width:16px; height:16px; border-radius:50%; border:2px solid #ffffff; box-shadow:0 0 8px rgba(16,185,129,0.8);"></div>`,
  iconSize: [16, 16]
});

const underwayIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color:#f59e0b; width:16px; height:16px; border-radius:50%; border:2px solid #ffffff; box-shadow:0 0 8px rgba(245,158,11,0.8);"></div>`,
  iconSize: [16, 16]
});

const stalledIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color:#ef4444; width:16px; height:16px; border-radius:50%; border:2px solid #ffffff; box-shadow:0 0 8px rgba(239,68,68,0.8);"></div>`,
  iconSize: [16, 16]
});

export default function InteractiveMap({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
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
        Loading GIS Spatial Project Map...
      </div>
    );
  }

  const varanasiCenter = [25.3176, 82.9739];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <MapPin className="w-4 h-4" />
            <span>PRD GIS SPATIAL EXPLORER • SECTION 7</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Spatial GIS Development Map</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real physical infrastructure works mapped to exact geo-coordinates across Parliamentary and Assembly constituencies.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Completed
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Underway
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Stalled
          </span>
        </div>
      </div>

      {/* Leaflet Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-2 h-[600px] overflow-hidden shadow-2xl relative">
        <MapContainer center={varanasiCenter} zoom={12} scrollWheelZoom={false} style={{ width: '100%', height: '100%', borderRadius: '12px' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {projects.map(proj => {
            const icon = proj.status === 'COMPLETED' ? completedIcon : proj.status === 'UNDERWAY' ? underwayIcon : stalledIcon;
            return (
              <Marker key={proj.id} position={[proj.lat, proj.lon]} icon={icon}>
                <Popup>
                  <div className="p-2 space-y-2 font-sans max-w-xs text-slate-900">
                    <div className="text-[10px] font-mono text-slate-500 font-bold">{proj.source_work_id}</div>
                    <div className="font-bold text-xs">{proj.title}</div>
                    <div className="text-[11px] text-slate-700">Cost: ₹{proj.sanctioned_cost.toLocaleString('en-IN')}</div>
                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="w-full mt-2 bg-slate-900 text-amber-400 text-xs py-1 px-2 rounded font-mono font-bold hover:bg-slate-800"
                    >
                      View Audit Trail
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
