import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Coins, 
  Sparkles, 
  Trophy, 
  Share2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Zap, 
  Heart, 
  GraduationCap, 
  Droplet, 
  Sun, 
  Truck, 
  Shield, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  Award, 
  Flame, 
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

// Web Audio API Sound Synthesizer (Zero external mp3 dependencies)
function playSound(type, soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.12); // E6
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'build') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'fanfare') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.frequency.value = freq;
        noteGain.gain.setValueAtTime(0.2, now + i * 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        noteOsc.start(now + i * 0.12);
        noteOsc.stop(now + i * 0.12 + 0.4);
      });
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // Audio context not allowed or supported
  }
}

// Available Playable Constituencies & Real MP Benchmark Data
const CONSTITUENCIES = [
  {
    id: 'varanasi',
    name: 'Varanasi (Uttar Pradesh)',
    mpName: 'Narendra Modi',
    party: 'BJP',
    tenure: '2014 – 2029',
    budget: 500000000, // ₹50.00 Cr
    realSpentPct: 82.4,
    realApprovalPct: 84.0,
    realWorksCount: 42,
    focusAreas: ['Solar Illumination', 'Ghat Tourism', 'Piped Water', 'Digital Libraries'],
    gridTheme: 'riverfront',
    description: 'Ancient spiritual capital on the Ganga with urgent urban renewal and solar energy needs.'
  },
  {
    id: 'rae-bareli',
    name: 'Rae Bareli (Uttar Pradesh)',
    mpName: 'Rahul Gandhi',
    party: 'INC',
    tenure: '2024 – 2029',
    budget: 500000000, // ₹50.00 Cr
    realSpentPct: 76.8,
    realApprovalPct: 79.5,
    realWorksCount: 36,
    focusAreas: ['Youth Skill Centers', 'Rural Healthcare', 'Drinking Water', 'Link Roads'],
    gridTheme: 'rural-mandi',
    description: 'Agrarian heartland needing healthcare facilities, youth employment centers, and road links.'
  },
  {
    id: 'gandhinagar',
    name: 'Gandhinagar (Gujarat)',
    mpName: 'Amit Shah',
    party: 'BJP',
    tenure: '2019 – 2029',
    budget: 500000000, // ₹50.00 Cr
    realSpentPct: 88.5,
    realApprovalPct: 86.2,
    realWorksCount: 48,
    focusAreas: ['Stormwater Drainage', 'Digital Smart Libraries', 'Solar ATMs', 'Highways'],
    gridTheme: 'planned-urban',
    description: 'Capital district balancing high-tech urban planning with peri-urban rural infrastructure.'
  },
  {
    id: 'nagpur',
    name: 'Nagpur (Maharashtra)',
    mpName: 'Nitin Gadkari',
    party: 'BJP',
    tenure: '2014 – 2029',
    budget: 500000000, // ₹50.00 Cr
    realSpentPct: 91.2,
    realApprovalPct: 89.0,
    realWorksCount: 52,
    focusAreas: ['EV Charging Canopies', 'Concrete Highways', 'Dialysis Centers', 'Storm Drains'],
    gridTheme: 'industrial-metro',
    description: 'Logistics and industrial crossroads known for aggressive road development and EV infrastructure.'
  },
  {
    id: 'wayanad',
    name: 'Wayanad (Kerala)',
    mpName: 'Priyanka Gandhi Vadra',
    party: 'INC',
    tenure: '2024 – 2029',
    budget: 500000000, // ₹50.00 Cr
    realSpentPct: 78.2,
    realApprovalPct: 81.0,
    realWorksCount: 34,
    focusAreas: ['Disaster Relief Shelters', 'Hill Drainage', 'Tribal Water', 'Eco-Tourism'],
    gridTheme: 'hill-forest',
    description: 'Scenic Western Ghats constituency facing acute climate landslides and tribal connectivity challenges.'
  },
  {
    id: 'thiruvananthapuram',
    name: 'Thiruvananthapuram (Kerala)',
    mpName: 'Dr. Shashi Tharoor',
    party: 'INC',
    tenure: '2009 – 2029',
    budget: 500000000, // ₹50.00 Cr
    realSpentPct: 84.6,
    realApprovalPct: 83.5,
    realWorksCount: 38,
    focusAreas: ['High School STEM Labs', 'Coastal Fisherfolk Halls', 'Solar Lights', 'Health'],
    gridTheme: 'coastal-tech',
    description: 'Coastal intellectual hub requiring advanced high-school STEM labs and coastal welfare assets.'
  },
  {
    id: 'chhoti-ramdi',
    name: 'Kadkariya - Chhoti Ramdi (Uttarakhand)',
    mpName: 'Geeta Rawat (Gram Pradhan) & Ajay Bhatt (MP)',
    party: 'Panchayati Raj / BJP',
    tenure: '2021 – 2026',
    budget: 50000000, // ₹5.00 Cr Panchayati / MLALADS pool
    realSpentPct: 86.0,
    realApprovalPct: 88.0,
    realWorksCount: 22,
    focusAreas: ['Solar Overhead Water Tanks', 'School CC Roads', 'Hill Drainage', 'High-Masts'],
    gridTheme: 'himalayan-village',
    description: 'Kumaon foothill Gram Sabha near Haldwani with urgent clean piped water and hill slope drainage needs.'
  }
];

// Development Project Catalog
const PROJECT_CATALOG = [
  {
    id: 'proj-solar-grid',
    title: 'Solar High-Mast Clean Grid',
    sector: 'Renewable Energy',
    icon: Sun,
    cost: 3800000, // ₹38 L
    costLabel: '₹38.0 L',
    description: 'Deploy solar high-mast towers and micro-grid storage at 15 major village/city crossings.',
    happinessBoost: 14,
    greenBoost: 22,
    healthBoost: 5,
    educationBoost: 4,
    infraBoost: 16,
    tileVisual: '☀️',
    badgeColor: 'bg-amber-500'
  },
  {
    id: 'proj-water-ro',
    title: 'Solar Deep Borewell & RO Plant',
    sector: 'Drinking Water',
    icon: Droplet,
    cost: 4200000, // ₹42 L
    costLabel: '₹42.0 L',
    description: 'Piped drinking water network providing 100,000+ liters of fluoride-free pure water daily.',
    happinessBoost: 20,
    greenBoost: 10,
    healthBoost: 25,
    educationBoost: 6,
    infraBoost: 14,
    tileVisual: '💧',
    badgeColor: 'bg-sky-500'
  },
  {
    id: 'proj-stem-lab',
    title: 'Smart STEM Lab & Digital Library',
    sector: 'Education',
    icon: GraduationCap,
    cost: 4500000, // ₹45 L
    costLabel: '₹45.0 L',
    description: 'Equip government secondary schools with AI workstations, robotics kits, and digital books.',
    happinessBoost: 18,
    greenBoost: 4,
    healthBoost: 0,
    educationBoost: 32,
    infraBoost: 12,
    tileVisual: '🎓',
    badgeColor: 'bg-indigo-500'
  },
  {
    id: 'proj-icu-ward',
    title: 'Critical Care ICU & Dialysis Unit',
    sector: 'Healthcare',
    icon: Heart,
    cost: 5500000, // ₹55 L
    costLabel: '₹55.0 L',
    description: 'Install 6 advanced dialysis stations and emergency life-support ventilators at community hospital.',
    happinessBoost: 24,
    greenBoost: 2,
    healthBoost: 35,
    educationBoost: 0,
    infraBoost: 18,
    tileVisual: '🏥',
    badgeColor: 'bg-rose-500'
  },
  {
    id: 'proj-paved-road',
    title: 'Heavy-Load Paved Concrete Road',
    sector: 'Connectivity',
    icon: Truck,
    cost: 5000000, // ₹50 L
    costLabel: '₹50.0 L',
    description: 'Interlocking concrete road connecting rural mandi clusters directly to the national highway.',
    happinessBoost: 16,
    greenBoost: 0,
    healthBoost: 8,
    educationBoost: 10,
    infraBoost: 28,
    tileVisual: '🛣️',
    badgeColor: 'bg-slate-600'
  },
  {
    id: 'proj-shg-center',
    title: 'Mahila Skill Center & SHG Hub',
    sector: 'Empowerment',
    icon: Users,
    cost: 4000000, // ₹40 L
    costLabel: '₹40.0 L',
    description: 'Vocational training hall with solar handlooms and food processing micro-units for women SHGs.',
    happinessBoost: 22,
    greenBoost: 8,
    healthBoost: 10,
    educationBoost: 18,
    infraBoost: 15,
    tileVisual: '🏛️',
    badgeColor: 'bg-purple-500'
  },
  {
    id: 'proj-ev-charging',
    title: 'Multi-Modal EV Solar Fast Charging',
    sector: 'Green Mobility',
    icon: Zap,
    cost: 6000000, // ₹60 L
    costLabel: '₹60.0 L',
    description: 'Rooftop solar canopy powering 12 public fast-charging points for e-autos and delivery fleets.',
    happinessBoost: 15,
    greenBoost: 30,
    healthBoost: 12,
    educationBoost: 2,
    infraBoost: 22,
    tileVisual: '⚡',
    badgeColor: 'bg-emerald-500'
  },
  {
    id: 'proj-drainage',
    title: 'Stormwater Slope Flood Drainage',
    sector: 'Disaster Safety',
    icon: Shield,
    cost: 5800000, // ₹58 L
    costLabel: '₹58.0 L',
    description: 'Reinforced concrete flood channel preventing annual monsoon waterlogging across low-lying wards.',
    happinessBoost: 19,
    greenBoost: 12,
    healthBoost: 18,
    educationBoost: 5,
    infraBoost: 25,
    tileVisual: '🌊',
    badgeColor: 'bg-blue-600'
  }
];

// Initial 16-Tile Isometric Grid Archetypes
const INITIAL_GRID_TILES = [
  { id: 0, label: 'North Ward Entrance', baseType: 'gate', building: null },
  { id: 1, label: 'Residential Mohalla 1', baseType: 'residential', building: null },
  { id: 2, label: 'Central Market Square', baseType: 'market', building: null },
  { id: 3, label: 'East Hill / Riverfront', baseType: 'river', building: null },
  
  { id: 4, label: 'Gram Panchayat / Ward Office', baseType: 'civic', building: null },
  { id: 5, label: 'Primary School Ground', baseType: 'school', building: null },
  { id: 6, label: 'Community Health Center', baseType: 'hospital', building: null },
  { id: 7, label: 'Artisan Workshop Zone', baseType: 'artisan', building: null },

  { id: 8, label: 'Agrarian Mandi Cluster', baseType: 'farm', building: null },
  { id: 9, label: 'Residential Mohalla 2', baseType: 'residential', building: null },
  { id: 10, label: 'Public Transit Crossing', baseType: 'transit', building: null },
  { id: 11, label: 'South Industrial Corridor', baseType: 'industrial', building: null },

  { id: 12, label: 'West Suburb Colony', baseType: 'residential', building: null },
  { id: 13, label: 'Water Reservoir Boundary', baseType: 'water', building: null },
  { id: 14, label: 'Youth Recreation Park', baseType: 'park', building: null },
  { id: 15, label: 'South Highway Bypass', baseType: 'highway', building: null }
];

export default function ConstituencyTycoon({ onExitGame }) {
  // Game Setup State
  const [selectedConst, setSelectedConst] = useState(CONSTITUENCIES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);

  // In-Game Dynamic States
  const [remainingBudget, setRemainingBudget] = useState(selectedConst.budget);
  const [gridTiles, setGridTiles] = useState(INITIAL_GRID_TILES);
  const [selectedTool, setSelectedTool] = useState(PROJECT_CATALOG[0]);
  const [builtHistory, setBuiltHistory] = useState([]);
  const [recentNotification, setRecentNotification] = useState(null);

  // Performance Metric Scores (0 - 100)
  const [scores, setScores] = useState({
    happiness: 35,
    greenEnergy: 20,
    health: 25,
    education: 30,
    infrastructure: 28
  });

  // Sync budget when constituency changes
  const handleSelectConstituency = (c) => {
    setSelectedConst(c);
    setRemainingBudget(c.budget);
    setGridTiles(INITIAL_GRID_TILES);
    setBuiltHistory([]);
    setGameEnded(false);
    setScores({
      happiness: 35,
      greenEnergy: 20,
      health: 25,
      education: 30,
      infrastructure: 28
    });
    playSound('coin', soundEnabled);
  };

  // Build Project on Grid Tile
  const handleTileClick = (tileId) => {
    if (gameEnded) return;

    const tile = gridTiles.find(t => t.id === tileId);
    if (!tile) return;

    if (tile.building) {
      // Tile already has building
      setRecentNotification({
        type: 'info',
        text: `Tile '${tile.label}' already has ${tile.building.title}. Select an empty plot!`
      });
      playSound('error', soundEnabled);
      return;
    }

    if (remainingBudget < selectedTool.cost) {
      setRecentNotification({
        type: 'error',
        text: `Insufficient funds! Need ${selectedTool.costLabel}, but only ₹${(remainingBudget / 100000).toFixed(1)}L left.`
      });
      playSound('error', soundEnabled);
      return;
    }

    // Place building!
    const newRemaining = remainingBudget - selectedTool.cost;
    setRemainingBudget(newRemaining);

    const updatedTiles = gridTiles.map(t => {
      if (t.id === tileId) {
        return { ...t, building: selectedTool };
      }
      return t;
    });
    setGridTiles(updatedTiles);

    // Update history
    setBuiltHistory(prev => [{
      tileId,
      tileLabel: tile.label,
      project: selectedTool,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);

    // Recalculate Scores
    setScores(prev => ({
      happiness: Math.min(100, prev.happiness + selectedTool.happinessBoost),
      greenEnergy: Math.min(100, prev.greenEnergy + selectedTool.greenBoost),
      health: Math.min(100, prev.health + selectedTool.healthBoost),
      education: Math.min(100, prev.education + selectedTool.educationBoost),
      infrastructure: Math.min(100, prev.infrastructure + selectedTool.infraBoost)
    }));

    setRecentNotification({
      type: 'success',
      text: `Constructed ${selectedTool.title} on ${tile.label}! +${selectedTool.happinessBoost}% Happiness`
    });

    playSound('build', soundEnabled);
  };

  // Calculate Overall Composite Score
  const overallCitizenScore = Math.round(
    (scores.happiness * 0.3) +
    (scores.greenEnergy * 0.15) +
    (scores.health * 0.2) +
    (scores.education * 0.15) +
    (scores.infrastructure * 0.2)
  );

  const budgetUtilizedPct = ((selectedConst.budget - remainingBudget) / selectedConst.budget) * 100;

  // Submit Final Term Audit & Trigger Showdown
  const handleSubmitAudit = () => {
    setGameEnded(true);
    playSound('fanfare', soundEnabled);
  };

  // Reset Game
  const handleResetGame = () => {
    setRemainingBudget(selectedConst.budget);
    setGridTiles(INITIAL_GRID_TILES);
    setBuiltHistory([]);
    setGameEnded(false);
    setScores({
      happiness: 35,
      greenEnergy: 20,
      health: 25,
      education: 30,
      infrastructure: 28
    });
    playSound('coin', soundEnabled);
  };

  // Share Result on Social Media
  const handleShareResult = () => {
    const text = `🎮 I scored a ${overallCitizenScore}% Citizen Approval Rating managing ${selectedConst.name} in Constituency Tycoon vs ${selectedConst.mpName}'s ${selectedConst.realApprovalPct}%! Can you beat your MP? Play now on Jan Nigrani: https://sarkari-seven.vercel.app`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('📋 Battle scorecard copied to clipboard! Share on WhatsApp / Twitter!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      {/* 1. Game Top Navigation & Control Bar */}
      <div className="bg-[#0b132e] text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                GOVERNANCE SIMULATOR
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold animate-pulse">
                ● LIVE AUDIT ENGINE
              </span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              Constituency Tycoon
            </h1>
          </div>
        </div>

        {/* Constituency Picker Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-2xl">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <select
              value={selectedConst.id}
              onChange={(e) => {
                const found = CONSTITUENCIES.find(c => c.id === e.target.value);
                if (found) handleSelectConstituency(found);
              }}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {CONSTITUENCIES.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.name} — MP: {c.mpName}
                </option>
              ))}
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleResetGame}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top HUD Dashboard: Real-time MoSPI Fund Meter & Vitality Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Remaining Budget */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md space-y-1 col-span-2 sm:col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase font-bold">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Coins className="w-4 h-4" />
              <span>MoSPI Parliamentary Fund</span>
            </span>
            <span className="text-emerald-400 font-bold">{budgetUtilizedPct.toFixed(1)}% Spent</span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            ₹{(remainingBudget / 10000000).toFixed(2)} <span className="text-sm font-sans font-normal text-slate-400">Cr left</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${budgetUtilizedPct}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Citizen Happiness Rating */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
            <span>Citizen Approval</span>
            <Flame className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="font-serif text-2xl font-bold text-slate-900">
            {scores.happiness}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Target: <strong className="text-indigo-600">&gt;80%</strong>
          </div>
        </div>

        {/* Metric 3: Clean Green Energy */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
            <span>Green Energy</span>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="font-serif text-2xl font-bold text-amber-600">
            {scores.greenEnergy}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Solar & EV Grid
          </div>
        </div>

        {/* Metric 4: Health & Water */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
            <span>Water & Health</span>
            <Heart className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="font-serif text-2xl font-bold text-rose-600">
            {Math.round((scores.health + scores.happiness) / 2)}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Borewell + ICU
          </div>
        </div>

        {/* Metric 5: Education & Youth */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
            <span>Education Index</span>
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="font-serif text-2xl font-bold text-indigo-600">
            {scores.education}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            STEM & Libraries
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {recentNotification && (
        <div className={`p-3 rounded-xl text-xs font-mono font-medium flex items-center justify-between gap-3 border transition-all animate-fadeIn ${
          recentNotification.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
          recentNotification.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200' :
          'bg-indigo-50 text-indigo-900 border-indigo-200'
        }`}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{recentNotification.text}</span>
          </div>
          <button onClick={() => setRecentNotification(null)} className="font-bold hover:underline">✕</button>
        </div>
      )}

      {/* 3. Main Gameplay Arena: Left (Toolbox), Center (Isometric City Grid), Right (Live Feed & Audit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Public Works Toolbox (Select what to construct) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                1. SELECT INFRASTRUCTURE TO BUILD
              </div>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                {PROJECT_CATALOG.length} Initiatives
              </span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {PROJECT_CATALOG.map(item => {
                const isSelected = selectedTool.id === item.id;
                const canAfford = remainingBudget >= item.cost;
                const IconComp = item.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedTool(item);
                      playSound('coin', soundEnabled);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : canAfford
                        ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                        : 'bg-slate-50/50 border-slate-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl ${item.badgeColor} text-white flex items-center justify-center text-sm shadow-sm shrink-0`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs leading-tight">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-mono text-indigo-600 font-semibold">
                            {item.sector}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono text-xs font-bold text-slate-900">
                          {item.costLabel}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 pt-1 border-t border-slate-200/50">
                      <span className="text-emerald-600 font-bold">+{item.happinessBoost}% Happiness</span>
                      <span>·</span>
                      <span className="text-indigo-600 font-semibold">Impact: {item.tileVisual}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Panel: Interactive Isometric 4x4 Constituency City Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-white relative overflow-hidden">
            {/* Background Map Grid Pattern */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
                  2. CLICK ANY PLOT TO CONSTRUCT SELECTED INITIATIVE
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5">
                  {selectedConst.name} — Interactive Ward Grid
                </h3>
              </div>

              <div className="text-right text-xs font-mono text-slate-400">
                Plots Built: <strong className="text-emerald-400 font-bold">{builtHistory.length} / 16</strong>
              </div>
            </div>

            {/* 4x4 Grid Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {gridTiles.map(tile => {
                const hasBuilding = Boolean(tile.building);

                return (
                  <div
                    key={tile.id}
                    onClick={() => handleTileClick(tile.id)}
                    className={`h-28 sm:h-32 rounded-2xl border p-3 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group select-none ${
                      hasBuilding
                        ? 'bg-slate-800/90 border-indigo-500/80 shadow-lg shadow-indigo-500/10 hover:border-indigo-400'
                        : 'bg-slate-800/30 hover:bg-slate-800/60 border-slate-700/60 hover:border-indigo-500/50 border-dashed'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>#{tile.id + 1}</span>
                      <span className="truncate max-w-[80px]">{tile.baseType}</span>
                    </div>

                    {hasBuilding ? (
                      <div className="text-center space-y-1 my-auto animate-bounce">
                        <div className="text-3xl filter drop-shadow-md">
                          {tile.building.tileVisual}
                        </div>
                        <div className="font-bold text-[11px] text-white leading-tight truncate px-1">
                          {tile.building.title}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center my-auto opacity-40 group-hover:opacity-90 transition-opacity space-y-0.5">
                        <div className="text-xl text-slate-400">➕</div>
                        <div className="text-[10px] font-mono text-indigo-300">Click to Build</div>
                      </div>
                    )}

                    <div className="text-[9px] font-mono text-slate-400 truncate text-center pt-1 border-t border-slate-700/40">
                      {tile.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action: Submit 5-Year Term Audit */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400">
                Ready to review your citizen performance vs <strong className="text-white">{selectedConst.mpName}</strong>?
              </div>

              <button
                onClick={handleSubmitAudit}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                <Trophy className="w-4 h-4 text-slate-950" />
                <span>Submit 5-Year Term Audit & Compare vs MP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SHOWDOWN MODAL / AUDIT REPORT CARD (The Viral Climax) */}
      {gameEnded && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white space-y-6 shadow-2xl relative animate-scaleUp my-8">
            
            {/* Header Badge */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950 px-4 py-1 rounded-full border border-emerald-800">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>OFFICIAL CAG CITIZEN AUDIT REPORT CARD</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Citizen MP vs Real MP Showdown
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                Constituency: <strong className="text-indigo-300">{selectedConst.name}</strong> · Real MP: <strong className="text-amber-400">{selectedConst.mpName} ({selectedConst.party})</strong>
              </p>
            </div>

            {/* Score Battle Cards: You vs Real MP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: YOU (Citizen MP) */}
              <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 p-6 rounded-2xl border border-indigo-500/50 space-y-4 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">YOUR CITIZEN TERM</span>
                    <h3 className="font-bold text-lg text-white">You (Citizen MP)</h3>
                  </div>
                  <div className="text-3xl font-serif font-black text-emerald-400">
                    {overallCitizenScore >= 85 ? 'S-Rank' : overallCitizenScore >= 75 ? 'A+' : overallCitizenScore >= 60 ? 'B' : 'C'}
                  </div>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between border-b border-indigo-900/60 pb-1">
                    <span className="text-slate-400">Citizen Approval:</span>
                    <strong className="text-emerald-400 text-sm">{overallCitizenScore}%</strong>
                  </div>
                  <div className="flex justify-between border-b border-indigo-900/60 pb-1">
                    <span className="text-slate-400">Budget Spent:</span>
                    <strong className="text-white">₹{((selectedConst.budget - remainingBudget) / 10000000).toFixed(2)} Cr ({budgetUtilizedPct.toFixed(1)}%)</strong>
                  </div>
                  <div className="flex justify-between border-b border-indigo-900/60 pb-1">
                    <span className="text-slate-400">Works Built:</span>
                    <strong className="text-white">{builtHistory.length} Initiatives</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Green Energy:</span>
                    <strong className="text-amber-400">{scores.greenEnergy}%</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Real MP (Actual MoSPI Government Records) */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">REAL MOSPI RECORD</span>
                    <h3 className="font-bold text-lg text-white">{selectedConst.mpName}</h3>
                  </div>
                  <div className="text-3xl font-serif font-black text-amber-400">
                    {selectedConst.realApprovalPct >= 85 ? 'A+' : selectedConst.realApprovalPct >= 75 ? 'A' : 'B'}
                  </div>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Official Approval:</span>
                    <strong className="text-amber-400 text-sm">{selectedConst.realApprovalPct}%</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Budget Spent:</span>
                    <strong className="text-white">₹{((selectedConst.budget * selectedConst.realSpentPct) / 1000000000).toFixed(2)} Cr ({selectedConst.realSpentPct}%)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Works Sanctioned:</span>
                    <strong className="text-white">{selectedConst.realWorksCount} Official Works</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tenure:</span>
                    <strong className="text-slate-300">{selectedConst.tenure}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict Banner */}
            <div className={`p-4 rounded-2xl border text-center space-y-1 ${
              overallCitizenScore >= selectedConst.realApprovalPct
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-amber-950/60 border-amber-500 text-amber-200'
            }`}>
              <div className="font-bold text-base">
                {overallCitizenScore >= selectedConst.realApprovalPct
                  ? `🎉 VICTORY! You outperformed ${selectedConst.mpName} by +${(overallCitizenScore - selectedConst.realApprovalPct).toFixed(1)}% Citizen Approval!`
                  : `⚠️ CLOSE BATTLE! ${selectedConst.mpName} leads by +${(selectedConst.realApprovalPct - overallCitizenScore).toFixed(1)}% Approval.`}
              </div>
              <p className="text-xs opacity-80">
                Based on sector diversity, health and solar allocations, and fiscal utilization vs MoSPI public benchmarks.
              </p>
            </div>

            {/* Share & Play Again Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleResetGame}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Play Another Term
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGameEnded(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                >
                  Continue Building
                </button>

                <button
                  onClick={handleShareResult}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg text-xs cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Battle Card (WhatsApp / X)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
