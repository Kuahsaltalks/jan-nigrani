import React, { useState, useEffect, useRef } from 'react';
import { 
  Train, 
  MapPin, 
  Flag, 
  Coins, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Share2,
  Building2,
  Calendar,
  Zap,
  Droplet,
  Sun,
  Truck,
  GraduationCap,
  Heart
} from 'lucide-react';

// Web Audio API Sound Synthesizer for Train Whistle & Chug
function playTrainSound(type, soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'whistle') {
      // Classic multi-tone train whistle
      const now = ctx.currentTime;
      [784, 988, 1175].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq + 15, now + 0.3);
        osc.frequency.linearRampToValueAtTime(freq, now + 0.8);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      });
    } else if (type === 'chug') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'arrival') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.35);
      });
    }
  } catch (e) {
    // Audio not supported or blocked
  }
}

// Indian Map Geographic Coordinate Projections (Normalized for 800x850 SVG Canvas)
// Center of Delhi / Sansad Bhavan: [x: 360, y: 280]
const DELHI_COORDS = { x: 360, y: 280, label: 'Sansad Bhavan (New Delhi)', state: 'National Capital' };

const DESTINATIONS = [
  {
    id: 'haldwani',
    name: 'Haldwani & Kadkariya Chhoti Ramdi',
    constituency: 'Nainital-Udhamsingh Nagar',
    state: 'Uttarakhand',
    coords: { x: 415, y: 250 }, // Northeast of Delhi
    distanceKm: 275,
    travelTime: '4 hrs via Kathgodam Express',
    repName: 'Ajay Bhatt',
    repOffice: 'MP (Lok Sabha) & Former MoS Defence',
    mlaName: 'Sumit Hridayesh (MLA Haldwani)',
    pradhanName: 'Smt. Geeta Rawat (Gram Pradhan, Kadkariya)',
    party: 'BJP / INC / Panchayati Raj',
    tenure: '2019 – 2029',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&q=80',
    totalBudget: 500000000, // ₹50.00 Cr
    spentBudget: 412000000, // ₹41.20 Cr
    unspentBudget: 88000000, // ₹8.80 Cr
    works: [
      { id: 'w1', title: 'Kadkariya-Chhoti Ramdi Solar Overhead Drinking Water Tank', cost: '₹18.5 L', sector: 'Drinking Water', status: 'COMPLETED', progress: 100 },
      { id: 'w2', title: 'Primary School Link Concrete Interlocking Road', cost: '₹12.0 L', sector: 'Roads & Connectivity', status: 'COMPLETED', progress: 100 },
      { id: 'w3', title: 'Kathgodam Hill Slope Flood Protection & Storm Drain', cost: '₹65.0 L', sector: 'Disaster Safety', status: 'UNDERWAY', progress: 80 },
      { id: 'w4', title: 'Haldwani Main Market Solar High-Mast Illumination', cost: '₹38.0 L', sector: 'Renewable Energy', status: 'COMPLETED', progress: 100 },
      { id: 'w5', title: 'Soban Singh Jeena Base Hospital Emergency Ward Expansion', cost: '₹45.0 L', sector: 'Healthcare', status: 'UNDERWAY', progress: 70 }
    ]
  },
  {
    id: 'varanasi',
    name: 'Varanasi (Kashi)',
    constituency: 'Varanasi Parliamentary Constituency',
    state: 'Uttar Pradesh',
    coords: { x: 535, y: 380 }, // East-Southeast of Delhi
    distanceKm: 780,
    travelTime: '8 hrs via Vande Bharat Express',
    repName: 'Narendra Modi',
    repOffice: 'Prime Minister of India & MP (Varanasi)',
    mlaName: 'Dr. Neelkanth Tiwari / Ravindra Jaiswal',
    pradhanName: 'N/A (Nagar Nigam / Rural Blocks)',
    party: 'Bharatiya Janata Party (BJP)',
    tenure: '2014 – 2029',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&q=80',
    totalBudget: 500000000,
    spentBudget: 428000000,
    unspentBudget: 72000000,
    works: [
      { id: 'w1', title: 'Smart Solar Community Learning Center & Digital Library', cost: '₹45.0 L', sector: 'Education & STEM', status: 'COMPLETED', progress: 100 },
      { id: 'w2', title: 'Assi Ghat & Dashashwamedh Solar High-Mast Corridor', cost: '₹38.0 L', sector: 'Renewable Energy', status: 'COMPLETED', progress: 100 },
      { id: 'w3', title: 'Deep Borewell Piped Drinking Water in Rohaniya', cost: '₹42.0 L', sector: 'Drinking Water', status: 'UNDERWAY', progress: 80 },
      { id: 'w4', title: 'Ramnagar CHC Primary Healthcare Diagnostic Lab', cost: '₹49.0 L', sector: 'Healthcare', status: 'COMPLETED', progress: 100 },
      { id: 'w5', title: 'Lohta Handloom Artisan Shed & Solar Loom Backup', cost: '₹36.0 L', sector: 'Community Assets', status: 'UNDERWAY', progress: 75 }
    ]
  },
  {
    id: 'rae-bareli',
    name: 'Rae Bareli',
    constituency: 'Rae Bareli Parliamentary Constituency',
    state: 'Uttar Pradesh',
    coords: { x: 480, y: 345 },
    distanceKm: 580,
    travelTime: '6.5 hrs via Express',
    repName: 'Rahul Gandhi',
    repOffice: 'Leader of Opposition & MP (Rae Bareli)',
    mlaName: 'Manoj Kumar Pandey (Unchahar)',
    pradhanName: 'N/A (Zila Panchayat)',
    party: 'Indian National Congress (INC)',
    tenure: '2024 – 2029',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80',
    totalBudget: 500000000,
    spentBudget: 384000000,
    unspentBudget: 116000000,
    works: [
      { id: 'w1', title: 'Bachhrawan District Youth Training & Skill Complex', cost: '₹48.0 L', sector: 'Education & STEM', status: 'COMPLETED', progress: 100 },
      { id: 'w2', title: 'Sareni Tehsil Piped Drinking Water Scheme', cost: '₹44.0 L', sector: 'Drinking Water', status: 'UNDERWAY', progress: 85 },
      { id: 'w3', title: 'Harchandpur Solar Street Lighting at 18 Crossings', cost: '₹35.0 L', sector: 'Renewable Energy', status: 'COMPLETED', progress: 100 },
      { id: 'w4', title: 'Unchahar Community Health Center Critical Care ICU', cost: '₹55.0 L', sector: 'Healthcare', status: 'COMPLETED', progress: 100 },
      { id: 'w5', title: 'Tiloi Concrete Link Road to Inhauna Mandi', cost: '₹52.0 L', sector: 'Roads & Transport', status: 'UNDERWAY', progress: 78 }
    ]
  },
  {
    id: 'gandhinagar',
    name: 'Gandhinagar',
    constituency: 'Gandhinagar Parliamentary Constituency',
    state: 'Gujarat',
    coords: { x: 235, y: 430 }, // West-Southwest of Delhi
    distanceKm: 915,
    travelTime: '10 hrs via Vande Bharat',
    repName: 'Amit Shah',
    repOffice: 'Union Home Minister & MP (Gandhinagar)',
    mlaName: 'Bhupendra Patel (Ghatlodia / CM Gujarat)',
    pradhanName: 'N/A (Gandhinagar Mahanagar)',
    party: 'Bharatiya Janata Party (BJP)',
    tenure: '2019 – 2029',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80',
    totalBudget: 500000000,
    spentBudget: 442000000,
    unspentBudget: 58000000,
    works: [
      { id: 'w1', title: 'Sanand Smart E-Library & Digital Skill Hub', cost: '₹55.0 L', sector: 'Education & STEM', status: 'COMPLETED', progress: 100 },
      { id: 'w2', title: 'Ghatlodia Underground Stormwater Drainage System', cost: '₹62.0 L', sector: 'Flood & Drainage', status: 'UNDERWAY', progress: 82 },
      { id: 'w3', title: 'Kalol Rural Rooftop Solar & Smart Water ATMs', cost: '₹41.0 L', sector: 'Renewable Energy', status: 'COMPLETED', progress: 100 }
    ]
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    state: 'Maharashtra',
    coords: { x: 420, y: 500 }, // South of Delhi
    distanceKm: 1080,
    travelTime: '12 hrs via Vande Bharat',
    repName: 'Nitin Gadkari',
    repOffice: 'Union Minister of Road Transport & MP (Nagpur)',
    mlaName: 'Devendra Fadnavis (Nagpur South West)',
    pradhanName: 'N/A (Nagpur Municipal Corp)',
    party: 'Bharatiya Janata Party (BJP)',
    tenure: '2014 – 2029',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80',
    totalBudget: 500000000,
    spentBudget: 456000000,
    unspentBudget: 44000000,
    works: [
      { id: 'w1', title: 'South West Nagpur EV Charging Hub & Solar Canopy', cost: '₹62.0 L', sector: 'Renewable Energy', status: 'COMPLETED', progress: 100 },
      { id: 'w2', title: 'Hingna Heavy Load Concrete Road & Drain', cost: '₹58.0 L', sector: 'Roads & Transport', status: 'UNDERWAY', progress: 85 },
      { id: 'w3', title: 'GMC Nagpur Dialysis & Palliative Care Center', cost: '₹65.0 L', sector: 'Healthcare', status: 'COMPLETED', progress: 100 }
    ]
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    constituency: 'Wayanad Parliamentary Constituency',
    state: 'Kerala',
    coords: { x: 330, y: 730 }, // Far South
    distanceKm: 2450,
    travelTime: '28 hrs via Rajdhani Express',
    repName: 'Priyanka Gandhi Vadra',
    repOffice: 'Member of Parliament (Wayanad)',
    mlaName: 'T. Siddique (Kalpetta)',
    pradhanName: 'Meppadi Gram Panchayat',
    party: 'Indian National Congress (INC)',
    tenure: '2024 – 2029',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&q=80',
    totalBudget: 500000000,
    spentBudget: 391000000,
    unspentBudget: 109000000,
    works: [
      { id: 'w1', title: 'Meppadi Disaster-Resilient Relief Shelter', cost: '₹42.0 L', sector: 'Community Assets', status: 'COMPLETED', progress: 100 },
      { id: 'w2', title: 'Sulthan Bathery Tribal Piped Drinking Water', cost: '₹39.0 L', sector: 'Drinking Water', status: 'UNDERWAY', progress: 80 },
      { id: 'w3', title: 'Chooralmala Landslide Slope Retaining Wall', cost: '₹54.0 L', sector: 'Flood & Drainage', status: 'UNDERWAY', progress: 70 }
    ]
  },
  {
    id: 'thiruvananthapuram',
    name: 'Thiruvananthapuram',
    constituency: 'Thiruvananthapuram Parliamentary Constituency',
    state: 'Kerala',
    coords: { x: 350, y: 810 }, // Southern Tip
    distanceKm: 2850,
    travelTime: '34 hrs via Kerala Express',
    repName: 'Dr. Shashi Tharoor',
    repOffice: 'Member of Parliament (Thiruvananthapuram)',
    mlaName: 'V. S. Sivakumar / Antony Raju',
    pradhanName: 'N/A (Trivandrum City Corp)',
    party: 'Indian National Congress (INC)',
    tenure: '2009 – 2029',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80',
    totalBudget: 500000000,
    spentBudget: 423000000,
    unspentBudget: 77000000,
    works: [
      { id: 'w1', title: 'Smart STEM Labs across 12 Government High Schools', cost: '₹52.0 L', sector: 'Education & STEM', status: 'COMPLETED', progress: 100 },
      { id: 'w2', title: 'Vizhinjam Coastal Solar Fisherfolk Center', cost: '₹46.0 L', sector: 'Community Assets', status: 'COMPLETED', progress: 100 }
    ]
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    constituency: 'Amritsar Parliamentary Constituency',
    state: 'Punjab',
    coords: { x: 310, y: 195 }, // Northwest of Delhi
    distanceKm: 450,
    travelTime: '5.5 hrs via Vande Bharat Express',
    repName: 'Gurjeet Singh Aujla',
    repOffice: 'Member of Parliament (Amritsar)',
    mlaName: 'Dr. Ajay Gupta (Amritsar Central)',
    pradhanName: 'N/A (Amritsar Municipal Corp)',
    party: 'Indian National Congress (INC)',
    tenure: '2017 – 2029',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80',
    totalBudget: 500000000,
    spentBudget: 405000000,
    unspentBudget: 95000000,
    works: [
      { id: 'w1', title: 'Golden Temple Corridor Solar Lighting & Tourist Kiosks', cost: '₹50.0 L', sector: 'Renewable Energy', status: 'COMPLETED', progress: 100 },
      { id: 'w2', title: 'Rural Chheharta Water Purification & RO ATM', cost: '₹38.0 L', sector: 'Drinking Water', status: 'COMPLETED', progress: 100 }
    ]
  },
  {
    id: 'guwahati',
    name: 'Guwahati',
    constituency: 'Guwahati Parliamentary Constituency',
    state: 'Assam',
    coords: { x: 700, y: 350 }, // Far Northeast
    distanceKm: 1880,
    travelTime: '26 hrs via Rajdhani Express',
    repName: 'Bijuli Kalita Medhi',
    repOffice: 'Member of Parliament (Guwahati)',
    mlaName: 'Siddhartha Bhattacharya (Gauhati East)',
    pradhanName: 'Kamrup Rural Zila',
    party: 'Bharatiya Janata Party (BJP)',
    tenure: '2024 – 2029',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&q=80',
    totalBudget: 500000000,
    spentBudget: 395000000,
    unspentBudget: 105000000,
    works: [
      { id: 'w1', title: 'Brahmaputra Riverside Flood Shelter & Embankment', cost: '₹62.0 L', sector: 'Flood & Drainage', status: 'UNDERWAY', progress: 75 },
      { id: 'w2', title: 'Dispur Government College STEM Lab & Library', cost: '₹44.0 L', sector: 'Education & STEM', status: 'COMPLETED', progress: 100 }
    ]
  }
];

export default function JanRathTrainMap({ onSelectConstituency }) {
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0]); // Default: Haldwani
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Train Animation States: 'IDLE', 'RUNNING', 'ARRIVED'
  const [trainStatus, setTrainStatus] = useState('IDLE');
  const [trainProgress, setTrainProgress] = useState(0); // 0 to 1
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);

  const animationFrameRef = useRef(null);

  // Filter destinations by search
  const filteredDests = DESTINATIONS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.constituency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.repName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Launch Train to Destination
  const launchTrain = (dest) => {
    setSelectedDest(dest);
    setTrainStatus('RUNNING');
    setTrainProgress(0);
    playTrainSound('whistle', soundEnabled);

    const startTime = performance.now();
    const duration = 2800; // 2.8 seconds smooth train ride

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Easing: easeInOutQuad
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setTrainProgress(easedProgress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setTrainStatus('ARRIVED');
        playTrainSound('arrival', soundEnabled);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Auto-launch train on first load to Haldwani!
    launchTrain(DESTINATIONS[0]);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Calculate Train Current Coordinates between Delhi and Destination
  const trainX = DELHI_COORDS.x + (selectedDest.coords.x - DELHI_COORDS.x) * trainProgress;
  const trainY = DELHI_COORDS.y + (selectedDest.coords.y - DELHI_COORDS.y) * trainProgress;

  // Calculate Train Angle for Rotation along Track
  const deltaX = selectedDest.coords.x - DELHI_COORDS.x;
  const deltaY = selectedDest.coords.y - DELHI_COORDS.y;
  const trainAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  // Share link
  const handleShare = () => {
    const text = `🚂 The Jan Rath Fund Express just travelled from Sansad Bhavan (Delhi) to ${selectedDest.name} (${selectedDest.state})! Verified ₹${(selectedDest.spentBudget / 10000000).toFixed(1)} Cr in public works delivered by MP ${selectedDest.repName}. Track your train here: https://sarkari-seven.vercel.app`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('📋 Train journey & accountability card copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-[#0b132e] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
              <Train className="w-3.5 h-3.5 text-amber-400" />
              <span>THE JAN RATH FUND EXPRESS • LIVE MONEY TRAIL</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              "Delhi se Paisa Chala Toh Sahi... Par Gaon Tak Pahuncha Kya?"
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Track the physical financial express train from **Parliament House (New Delhi)** to your home constituency. Watch the train unload verified public works and unspent treasury funds!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-slate-300 transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-mono"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>{soundEnabled ? 'Audio SFX On' : 'Muted'}</span>
            </button>

            <button
              onClick={() => launchTrain(selectedDest)}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md flex items-center gap-1.5 text-xs font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rerun Train</span>
            </button>
          </div>
        </div>

        {/* Quick Route Selector Chips */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Popular Express Routes:</span>
          {DESTINATIONS.map(d => (
            <button
              key={d.id}
              onClick={() => launchTrain(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedDest.id === d.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
            >
              🚂 Delhi &rarr; {d.name.split(' ')[0]} ({d.state})
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Visual Canvas: Interactive Indian Map (SVG) + Train Animation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: The Map & Animated Railway Track */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 p-4 sm:p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>ROUTE: {DELHI_COORDS.label} &rarr; {selectedDest.name} ({selectedDest.distanceKm} km)</span>
            </span>
            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
              trainStatus === 'ARRIVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              {trainStatus === 'RUNNING' ? '🚄 EN ROUTE (Speed: 160 km/h)' : '🏁 DESTINATION REACHED'}
            </span>
          </div>

          {/* SVG Map of India with Railway Track & Animated Train */}
          <div className="relative w-full aspect-[4/4.2] max-h-[580px] my-auto">
            <svg
              viewBox="0 0 800 850"
              className="w-full h-full drop-shadow-2xl select-none"
            >
              {/* Background Grid & Compass */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
                
                {/* Glowing Gradients */}
                <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                </linearGradient>

                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <rect width="800" height="850" fill="transparent" />
              <rect width="800" height="850" fill="url(#grid)" />

              {/* Simplified India Territorial Outline */}
              <path
                d="M 330 110 L 360 80 L 400 130 L 420 180 L 480 230 L 530 250 L 590 260 L 680 280 L 730 310 L 710 380 L 650 390 L 600 370 L 560 410 L 540 480 L 500 560 L 460 650 L 400 750 L 370 820 L 340 820 L 320 740 L 300 660 L 260 560 L 220 480 L 190 410 L 220 350 L 250 280 L 290 220 Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* Major Indian River System (Ganga & Yamuna) */}
              <path
                d="M 360 280 Q 450 330 535 380 T 630 400"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="2"
                strokeOpacity="0.6"
              />

              {/* All Destination Node Markers on India Map */}
              {DESTINATIONS.map(d => {
                const isCurrent = d.id === selectedDest.id;
                return (
                  <g 
                    key={d.id} 
                    className="cursor-pointer group"
                    onClick={() => launchTrain(d)}
                  >
                    <circle
                      cx={d.coords.x}
                      cy={d.coords.y}
                      r={isCurrent ? 8 : 5}
                      fill={isCurrent ? '#10b981' : '#64748b'}
                      stroke={isCurrent ? '#ffffff' : '#1e293b'}
                      strokeWidth={2}
                      className={isCurrent ? 'animate-ping opacity-75' : ''}
                    />
                    <circle
                      cx={d.coords.x}
                      cy={d.coords.y}
                      r={isCurrent ? 7 : 4}
                      fill={isCurrent ? '#10b981' : '#94a3b8'}
                    />
                    <text
                      x={d.coords.x + 10}
                      y={d.coords.y + 4}
                      fill={isCurrent ? '#38bdf8' : '#64748b'}
                      fontSize={isCurrent ? "12" : "10"}
                      fontFamily="monospace"
                      fontWeight={isCurrent ? "bold" : "normal"}
                    >
                      {d.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* SANSAD BHAVAN / DELHI ORIGIN HUB */}
              <g>
                <circle
                  cx={DELHI_COORDS.x}
                  cy={DELHI_COORDS.y}
                  r="14"
                  fill="#f59e0b"
                  fillOpacity="0.3"
                  className="animate-pulse"
                />
                <circle
                  cx={DELHI_COORDS.x}
                  cy={DELHI_COORDS.y}
                  r="8"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={DELHI_COORDS.x - 70}
                  y={DELHI_COORDS.y - 14}
                  fill="#fcd34d"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  🏛️ NEW DELHI (SANSAD)
                </text>
              </g>

              {/* The Glowing Railway Track from Delhi to Selected Destination */}
              <line
                x1={DELHI_COORDS.x}
                y1={DELHI_COORDS.y}
                x2={selectedDest.coords.x}
                y2={selectedDest.coords.y}
                stroke="#1e293b"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1={DELHI_COORDS.x}
                y1={DELHI_COORDS.y}
                x2={selectedDest.coords.x}
                y2={selectedDest.coords.y}
                stroke="url(#trackGrad)"
                strokeWidth="3.5"
                strokeDasharray="8 4"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* THE JAN RATH / VANDE BHARAT TRAIN (Moving along Track) */}
              <g
                transform={`translate(${trainX}, ${trainY}) rotate(${trainAngle})`}
                className="transition-transform duration-75"
              >
                {/* Train Glow Aura */}
                <ellipse cx="0" cy="0" rx="22" ry="12" fill="#38bdf8" fillOpacity="0.4" filter="url(#glow)" />
                
                {/* Train Body */}
                <rect x="-18" y="-7" width="36" height="14" rx="5" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
                <rect x="-10" y="-5" width="8" height="10" rx="2" fill="#0284c7" />
                <rect x="2" y="-5" width="8" height="10" rx="2" fill="#0284c7" />
                <polygon points="18,-4 24,0 18,4" fill="#f59e0b" />
                
                {/* Headlight beam */}
                <polygon points="24,-2 60,-16 60,16 24,2" fill="#fef08a" fillOpacity="0.25" />
              </g>

              {/* DESTINATION ARRIVAL CEREMONY: FLAGGING & FIREWORKS */}
              {trainStatus === 'ARRIVED' && (
                <g transform={`translate(${selectedDest.coords.x}, ${selectedDest.coords.y})`}>
                  {/* Glowing Destination Ring */}
                  <circle cx="0" cy="0" r="24" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
                  
                  {/* The Official Flag Pole */}
                  <line x1="0" y1="0" x2="0" y2="-42" stroke="#e2e8f0" strokeWidth="2.5" />
                  
                  {/* The Tricolor / Accountability Flag */}
                  <g transform="translate(0, -42)">
                    <rect x="0" y="0" width="26" height="6" fill="#f97316" rx="1" />
                    <rect x="0" y="6" width="26" height="6" fill="#ffffff" />
                    <circle cx="13" cy="9" r="2.5" fill="#1e3a8a" />
                    <rect x="0" y="12" width="26" height="6" fill="#16a34a" rx="1" />
                  </g>

                  {/* Destination Label Pill */}
                  <rect x="-60" y="10" width="120" height="22" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                  <text x="0" y="25" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    📍 {selectedDest.name.split(' ')[0]}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Timeline Progress Bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Delhi MoSPI Treasury</span>
              <span className="text-amber-400 font-bold">{Math.round(trainProgress * 100)}% Journey Completed</span>
              <span>{selectedDest.name}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 transition-all duration-100"
                style={{ width: `${trainProgress * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: The Cargo Manifest, Unloaded Public Works & MP Summary */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* A. Destination & Representative Dossier Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start gap-3.5">
              <img
                src={selectedDest.photoUrl}
                alt={selectedDest.repName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-md shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 uppercase">
                  {selectedDest.party}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 leading-tight">
                  {selectedDest.repName}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {selectedDest.repOffice}
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-0.5">
                  Tenure: <strong className="text-slate-700">{selectedDest.tenure}</strong>
                </div>
              </div>
            </div>

            {/* Local Assembly & Pradhan crosswalk if present */}
            {selectedDest.pradhanName && (
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs font-mono">
                <div className="text-[10px] uppercase font-bold text-slate-400">Local Tier Resolution:</div>
                <div className="text-slate-800"><strong>MLA:</strong> {selectedDest.mlaName}</div>
                <div className="text-emerald-700"><strong>Gram Pradhan:</strong> {selectedDest.pradhanName}</div>
              </div>
            )}

            {/* Financial Ledger Balance Breakdown */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center font-mono text-xs">
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block uppercase font-bold">Unloaded on Ground</span>
                <span className="text-base font-bold text-emerald-800">
                  ₹{(selectedDest.spentBudget / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-amber-700 block uppercase font-bold">Held in Treasury</span>
                <span className="text-base font-bold text-amber-800">
                  ₹{(selectedDest.unspentBudget / 10000000).toFixed(2)} Cr
                </span>
              </div>
            </div>
          </div>

          {/* B. Train Cargo Boxes (Unloaded Works with Proof Verification) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-emerald-600" />
                <span>UNLOADED CARGO WORKS ({selectedDest.works.length})</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Verified Ground Audits
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {selectedDest.works.map((work, idx) => (
                <div
                  key={work.id}
                  className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span className="text-indigo-600 font-semibold">{work.sector}</span>
                        <span>·</span>
                        <span>Cargo #{idx + 1}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug">
                        {work.title}
                      </h4>
                    </div>

                    <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                      {work.cost}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-200/60">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{work.status} ({work.progress}%)</span>
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      Official MoSPI Proof Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Share Train Journey */}
            <button
              onClick={handleShare}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share {selectedDest.name} Train Journey (WhatsApp / X)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
