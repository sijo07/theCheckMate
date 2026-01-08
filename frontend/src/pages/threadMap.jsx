import React, { useEffect, useState, useMemo } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  List,
  Target,
  Shield,
  Activity,
  AlertTriangle,
  Globe,
  Radio,
  X,
  Crosshair,
  Wifi,
  Terminal,
  ChevronRight,
  Cpu,
  Database,
  Search,
  Zap
} from "lucide-react";
import {
  useGetAllIncidentsQuery,
  useResolveIncidentMutation,
} from "../redux/api/incidentApiSlice";
import { useSelector } from "react-redux";
import { BASE_URL } from "../redux/constants";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { toast } from "react-toastify";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mapStyles = `
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  .map-frame {
    background: #0a0a0f;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.7);
    position: relative;
    overflow: hidden;
  }

  .tactical-tooltip {
    position: absolute;
    z-index: 1000;
    pointer-events: none;
    background: rgba(20, 20, 30, 0.95);
    backdrop-filter: blur(12px);
    border-left: 3px solid #ef4444;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 14px;
    font-family: 'Inter', monospace;
    min-width: 240px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(239, 68, 68, 0.2);
  }

  .tooltip-label {
    font-size: 8px;
    text-transform: uppercase;
    color: #555;
    letter-spacing: 2px;
    margin-bottom: 2px;
    display: block;
    font-weight: 800;
  }

  .tooltip-value {
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .cyber-grid {
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 50px 50px;
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0.7;
  }

  .hud-box {
    background: rgba(10, 10, 15, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 12px 18px;
    pointer-events: auto;
  }

  /* Threat Lines & Arcs */
  .threat-arc {
    fill: none;
    stroke-linecap: round;
    transition: stroke-opacity 0.3s ease;
  }

  .data-packet {
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 4, 100;
    animation: packet-flow 2s infinite linear;
  }

  @keyframes packet-flow {
    from { stroke-dashoffset: 104; }
    to { stroke-dashoffset: 0; }
  }

  /* Scanline overlay */
  .map-frame::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(255, 255, 255, 0.1) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 40;
    opacity: 0.5;
  }
`;

// --- Mock Data Augmentation ---
const capitals = [
  { name: "United States", lat: 37.0902, lng: -95.7129 },
  { name: "China", lat: 35.8617, lng: 104.1954 },
  { name: "Russia", lat: 61.5240, lng: 105.3188 },
  { name: "Germany", lat: 51.1657, lng: 10.4515 },
  { name: "United Kingdom", lat: 55.3781, lng: -3.4360 },
  { name: "Brazil", lat: -14.2350, lng: -51.9253 },
  { name: "India", lat: 20.5937, lng: 78.9629 },
  { name: "Japan", lat: 36.2048, lng: 138.2529 },
  { name: "Australia", lat: -25.2744, lng: 133.7751 },
  { name: "Canada", lat: 56.1304, lng: -106.3468 },
  { name: "France", lat: 46.2276, lng: 2.2137 },
  { name: "South Korea", lat: 35.9078, lng: 127.7669 }
];

const getRandomLocation = () => capitals[Math.floor(Math.random() * capitals.length)];

const getThreatDetails = (type) => {
  const map = {
    'Ransomware': { severity: 'critical', color: '#ff0055', icon: 'zap' },
    'DDoS': { severity: 'critical', color: '#ff00ff', icon: 'activity' },
    'Malware': { severity: 'high', color: '#ff6600', icon: 'shield' },
    'Unauthorized Access': { severity: 'high', color: '#ffaa00', icon: 'terminal' },
    'Phishing': { severity: 'medium', color: '#ffff00', icon: 'alert-triangle' },
    'Exploits': { severity: 'medium', color: '#00ffff', icon: 'target' },
  };
  return map[type] || { severity: 'low', color: '#00aaff', icon: 'globe' }; // Changed from green to Cyber Blue
};

const enrichIncident = (inc) => {
  const sourceLoc = inc.source?.lat ? inc.source : getRandomLocation();
  // Backend uses 'target', frontend previously used 'location'. Support both.
  const targetLoc = inc.target?.lat ? inc.target : (inc.location?.lat ? inc.location : getRandomLocation());

  // Ensure source and target are not the same for visual clarity
  const finalTarget = (sourceLoc.lat === targetLoc.lat && sourceLoc.lng === targetLoc.lng)
    ? capitals[(capitals.findIndex(c => c.lat === targetLoc.lat) + 1) % capitals.length]
    : targetLoc;

  const details = getThreatDetails(inc.type);

  return {
    ...inc,
    severity: inc.severity || details.severity,
    color: details.color,
    icon: details.icon,
    status: inc.status || 'active',
    location: {
      country: finalTarget.country || finalTarget.name,
      lat: finalTarget.lat,
      lng: finalTarget.lng
    },
    source: {
      country: sourceLoc.country || sourceLoc.name,
      lat: sourceLoc.lat,
      lng: sourceLoc.lng
    }
  };
};

const getSeverityRGB = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical': return '239, 68, 68';
    case 'high': return '249, 115, 22';
    case 'medium': return '234, 179, 8';
    case 'low': return '59, 130, 246';
    default: return '107, 114, 128';
  }
};

const ThreadMap = () => {
  const [realtimeIncidents, setRealtimeIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoveredIncident, setHoveredIncident] = useState(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const [selectedSeverities, setSelectedSeverities] = useState(['critical', 'high', 'medium', 'low']);
  const [selectedStatuses, setSelectedStatuses] = useState(['active', 'investigating']);

  const { userInfo } = useSelector((state) => state.auth);
  const { data: incidentsData, isLoading } = useGetAllIncidentsQuery(undefined, { pollingInterval: 30000 });

  useEffect(() => {
    const socket = io(BASE_URL);
    socket.on('new-incident', (payload) => {
      // Backend emits [incident] or incident. Normalizing to array.
      const incoming = Array.isArray(payload) ? payload : [payload];

      incoming.forEach(incident => {
        setRealtimeIncidents(prev => [enrichIncident(incident), ...prev]);
        if (incident?.severity === 'critical') {
          toast.error(`CRITICAL THREAT DETECTED: ${incident.type.toUpperCase()}`);
        }
      });
    });
    return () => socket.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(Math.floor(e.clientX - rect.left));
    setMouseY(Math.floor(e.clientY - rect.top));
  };

  const incidents = useMemo(() => {
    const base = Array.isArray(incidentsData) ? incidentsData : [];
    const combined = [...realtimeIncidents, ...base.map(enrichIncident)];
    return Array.from(new Map(combined.filter(i => i._id).map(item => [item._id, item])).values());
  }, [incidentsData, realtimeIncidents]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc =>
      selectedSeverities.includes(inc.severity?.toLowerCase()) &&
      selectedStatuses.includes(inc.status?.toLowerCase())
    );
  }, [incidents, selectedSeverities, selectedStatuses]);

  const aggregatedTargets = useMemo(() => {
    const map = new Map();
    filteredIncidents.forEach(inc => {
      const key = `${inc.location.lat},${inc.location.lng}`;
      if (!map.has(key)) {
        map.set(key, inc);
      }
    });
    return Array.from(map.values());
  }, [filteredIncidents]);

  const aggregatedSources = useMemo(() => {
    const map = new Map();
    filteredIncidents.forEach(inc => {
      const key = `${inc.source.lat},${inc.source.lng}`;
      if (!map.has(key)) {
        map.set(key, inc);
      }
    });
    return Array.from(map.values());
  }, [filteredIncidents]);

  const [resolveIncident] = useResolveIncidentMutation();

  const handleIncidentClick = (incident) => {
    console.log("SELECTED INCIDENT:", incident);
    setSelectedIncident(incident);
  };

  const handleDeployCountermeasure = async () => {
    if (!selectedIncident || !selectedIncident._id) {
      toast.error("TARGET LOCK FAILED: INVALID ID");
      return;
    }
    try {
      await resolveIncident(selectedIncident._id).unwrap();
      toast.success("COUNTERMEASURE DEPLOYED: THREAT NEUTRALIZED");
      setSelectedIncident(null);
    } catch (err) {
      toast.error("DEPLOYMENT FAILED: UPLINK ERROR");
    }
  };

  const toggleSeverity = (sev) => {
    setSelectedSeverities(prev => prev.includes(sev) ? prev.filter(s => s !== sev) : [...prev, sev]);
  };

  // Arc Path Calculation for 3D effect with bundling support
  const getArcPath = (projectedSource, projectedTarget, seed = 0) => {
    const [x1, y1] = projectedSource;
    const [x2, y2] = projectedTarget;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // Lift the arc based on distance, but capped
    const lift = Math.min(dist * 0.4, 120); // Increased max lift slightly

    // Add bundling offset based on seed
    const offset = (seed % 20) - 10;
    const controlX = midX + (offset * 0.5);
    const controlY = midY - lift + offset;

    return `M ${x1},${y1} Q ${controlX},${controlY} ${x2},${y2}`;
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[#020202] text-red-500 uppercase tracking-widest font-bold font-mono">
      <div className="flex flex-col items-center gap-4">
        <Activity className="animate-spin w-10 h-10" />
        <span className="animate-pulse">Initializing Satellite Uplink...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-10 lg:pt-24 px-4 sm:px-6 lg:px-8 pb-12 font-mono relative overflow-hidden selection:bg-red-500 selection:text-white">
      <style>{mapStyles}</style>

      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="cyber-grid" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">

        {/* Sidebar (Tactical Ticker) */}
        <div className="lg:col-span-1 h-[82vh] flex flex-col bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/15 relative overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/10 bg-gradient-to-r from-red-900/10 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Tactical_Live_Log</span>
            </div>
            <div className="text-[9px] text-gray-500 font-mono">NODE_ID: 08-ALPHA</div>
          </div>

          <div className="flex border-b border-white/10 bg-black/40">
            {['feed', 'filters'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-[9px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
              >
                {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute inset-0 bg-red-600/5 border-b-2 border-red-600" />}
                <span className="relative z-10">{tab === 'feed' ? 'Live_Event_Log' : 'Subroutines'}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <AnimatePresence mode="wait">
              {activeTab === 'feed' ? (
                <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="divide-y divide-white/5 bg-black/20">
                  {filteredIncidents.map((inc, i) => (
                    <div
                      key={inc._id || i}
                      onClick={() => handleIncidentClick(inc)}
                      onMouseEnter={() => setHoveredIncident(inc)}
                      onMouseLeave={() => setHoveredIncident(null)}
                      className="p-4 hover:bg-white/[0.03] cursor-pointer border-l-2 border-transparent hover:border-white/20 transition-all group"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: inc.color }} />
                          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: inc.color }}>{inc.severity}</span>
                        </div>
                        <span className="text-[8px] text-gray-600 font-mono tracking-tighter">[{new Date(inc.timestamp || Date.now()).toLocaleTimeString()}]</span>
                      </div>
                      <div className="text-xs font-bold text-gray-300 group-hover:text-white uppercase truncate mb-1.5 tracking-wide">
                        {inc.type}
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-gray-500 font-bold uppercase">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500/80">{inc.source?.country?.slice(0, 3)}</span>
                          <ChevronRight size={8} className="text-white/20" />
                          <span className="text-white/70">{inc.location?.country?.slice(0, 3)}</span>
                        </div>
                        <div className="px-1.5 py-0.5 bg-white/[0.03] border border-white/5 rounded text-[8px]">
                          {(Math.random() * 10).toFixed(1)} GB/s
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] flex items-center gap-2">
                      <Filter size={10} /> Geospatial_Filters
                    </h3>
                    <div className="space-y-3">
                      {['critical', 'high', 'medium', 'low'].map((sev) => (
                        <label key={sev} className="flex items-center justify-between cursor-pointer p-4 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group">
                          <div className="flex items-center gap-4">
                            <input type="checkbox" checked={selectedSeverities.includes(sev)} onChange={() => toggleSeverity(sev)} className="hidden" />
                            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${selectedSeverities.includes(sev) ? 'bg-white text-black border-white' : 'border-white/20 group-hover:border-white/40'}`}>
                              {selectedSeverities.includes(sev) && <X size={10} />}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectedSeverities.includes(sev) ? 'text-white' : 'text-gray-600'}`}>
                              {sev}_Lvl
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-700 font-mono">
                            {filteredIncidents.filter(i => i.severity?.toLowerCase() === sev).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Global Metric Summary */}
          <div className="p-6 bg-black border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[8px] text-gray-600 uppercase mb-1 font-black">Global_Threat</span>
              <span className="text-lg font-black text-red-600 tabular-nums">HI-CON 4</span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] text-gray-600 uppercase mb-1 font-black">Active_Nodes</span>
              <span className="text-lg font-black text-white tabular-nums">{filteredIncidents.length}</span>
            </div>
          </div>
        </div>

        {/* Map Display */}
        <div className="lg:col-span-3 h-[82vh] map-frame relative" onMouseMove={handleMouseMove}>

          {/* Tactical Tooltip */}
          <AnimatePresence>
            {/* Country/Place Tooltip */}
            {(hoveredCountry && !hoveredIncident) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-[1000] pointer-events-none bg-[#050505]/95 backdrop-blur-md border border-white/20 p-2.5 px-4 shadow-2xl"
                style={{ left: mouseX + 15, top: mouseY - 40 }}
              >
                <div className="relative z-10">
                  <span className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase block mb-1">Target_Area</span>
                  <span className="text-sm font-bold text-white uppercase tracking-widest">{hoveredCountry}</span>
                </div>
                {/* Decorative HUD Elements */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40" />
              </motion.div>
            )}

            {hoveredIncident && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="tactical-tooltip"
                style={{ left: mouseX + 25, top: mouseY - 20 }}
              >
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                  <div className="w-3 h-3 rounded-sm rotate-45" style={{ backgroundColor: hoveredIncident.color }} />
                  <div>
                    <span className="tooltip-label" style={{ color: hoveredIncident.color }}>{hoveredIncident.severity} Alert</span>
                    <span className="text-xs font-black text-white uppercase tracking-wider">{hoveredIncident.type}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="tooltip-label">Origin</span>
                    <span className="tooltip-value text-red-500">{hoveredIncident.source?.country}</span>
                    <div className="text-[9px] text-gray-600 font-mono mt-0.5">IP: 184.22.X.X</div>
                  </div>
                  <div className="text-right">
                    <span className="tooltip-label">Destination</span>
                    <span className="tooltip-value">{hoveredIncident.location?.country}</span>
                    <div className="text-[9px] text-gray-600 font-mono mt-0.5">PKT: 1.2MB</div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 text-[9px] text-gray-400 font-mono">
                  <div className="flex justify-between mb-1">
                    <span>TRACE_ID</span>
                    <span className="text-gray-500">#{hoveredIncident._id?.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CONFIDENCE</span>
                    <span className="text-emerald-500">98.4%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-30">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-4">
                <div className="hud-box border-l-2 border-l-red-600">
                  <div className="flex items-center gap-3 mb-1">
                    <Target size={12} className="text-red-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/90">Orbital_Vantage_v9</span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 tracking-tighter">
                    GEO_L: {mouseY}.{Math.floor(Math.random() * 999)} // ALT: 35.8K KM
                  </div>
                </div>

                <div className="hud-box border-l-2 border-l-emerald-500 bg-emerald-500/5">
                  <div className="flex items-center gap-3 mb-1">
                    <Wifi size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/90">Intelligence_Streams</span>
                  </div>
                  <div className="text-xl font-black font-mono text-white tabular-nums">
                    {incidents.length.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="hud-box flex flex-col items-end">
                <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1.5">System_Uptime</div>
                <div className="flex gap-0.5 h-3 items-end">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`w-1 ${i < 8 ? 'bg-red-600/60' : 'bg-white/5'} h-${Math.floor(Math.random() * 3) + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 155, center: [0, 25] }} className="w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Digital Geography Pattern */}
              <pattern id="dotPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="#333340" />
              </pattern>
            </defs>

            <Geographies geography={geoUrl}>
              {({ geographies }) => geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={hoveredCountry === geo.properties.name ? "rgba(60, 60, 70, 0.8)" : "url(#dotPattern)"}
                  stroke={hoveredCountry === geo.properties.name ? "rgba(239, 68, 68, 0.6)" : "rgba(255, 255, 255, 0.15)"}
                  strokeWidth={0.5}
                  onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  style={{
                    default: { outline: "none", transition: "fill 0.3s ease" },
                    hover: { outline: "none", cursor: "crosshair" },
                    pressed: { outline: "none" }
                  }}
                />
              ))}
            </Geographies>

            {/* Arcing Attack Vectors */}
            <g>
              {filteredIncidents.map((incident, idx) => {
                const src = incident.source;
                const dst = incident.location;
                if (!src?.lat || !dst?.lat) return null;

                // Simple projection for arc calculation (approximate since we're in SVG space)
                // Note: In a real app we'd project the coordinates properly, but here we estimate for visuals
                const isRelevant = !hoveredCountry || src.country === hoveredCountry || dst.country === hoveredCountry;

                // Manual estimation of projected points based on standard Mercator center/scale
                const getPos = (lng, lat) => {
                  const x = (lng + 180) * (800 / 360);
                  const y = (90 - lat) * (450 / 180);
                  return [x, y];
                };

                // We use the react-simple-maps provided props via projection if we were inside a component,
                // but here we just need to render the paths behind/over markers.
                // For now, let's stick to react-simple-maps Line with a custom curvature if possible,
                // or just use a standard Line and apply the design refinement.

                // IMPORTANT: react-simple-maps Line doesn't support Q curves easily without custom projection.
                // So we'll use a standard Line for geometry but styling it heavily.

                const bundleSeed = parseInt(incident._id?.slice(-4), 16) || idx;

                return (
                  <React.Fragment key={idx}>
                    {/* Base Thread Line */}
                    <path
                      d={getArcPath([(src.lng + 180) * 2.22, (90 - src.lat) * 2.5], [(dst.lng + 180) * 2.22, (90 - dst.lat) * 2.5], bundleSeed)}
                      className="threat-arc"
                      stroke={incident.color}
                      strokeWidth={hoveredIncident?._id === incident._id ? 1.2 : 0.4}
                      strokeOpacity={hoveredCountry ? (isRelevant ? 0.3 : 0.05) : (hoveredIncident?._id === incident._id ? 0.8 : 0.1)}
                      onMouseEnter={() => setHoveredIncident(incident)}
                      onMouseLeave={() => setHoveredIncident(null)}
                      filter={hoveredIncident?._id === incident._id ? "url(#glow)" : ""}
                    />
                    {/* Animated Data Packets (Cyber Pulse) */}
                    <path
                      d={getArcPath([(src.lng + 180) * 2.22, (90 - src.lat) * 2.5], [(dst.lng + 180) * 2.22, (90 - dst.lat) * 2.5], bundleSeed)}
                      className="data-packet"
                      stroke={incident.color}
                      strokeWidth={incident.severity === 'critical' ? 2 : 1.4}
                      strokeOpacity={hoveredCountry ? (isRelevant ? 1 : 0) : 0.8}
                      onMouseEnter={() => setHoveredIncident(incident)}
                      onMouseLeave={() => setHoveredIncident(null)}
                      style={{
                        animationDuration: `${incident.severity === 'critical' ? 0.8 : 1.5 + (bundleSeed % 5) * 0.1}s`,
                        filter: `drop-shadow(0 0 3px ${incident.color})`
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </g>

            {/* Nodes */}
            {/* Render unique Source Points */}
            {aggregatedSources.map((incident, idx) => (
              <Marker key={`src-${idx}`} coordinates={[incident.source.lng, incident.source.lat]} className="pointer-events-none">
                <circle r={1.2} fill={incident.color} className="opacity-40" />
              </Marker>
            ))}

            {/* Render unique Target Points */}
            {aggregatedTargets.map((incident, idx) => {
              const isSelected = selectedIncident?._id === incident._id;
              const isHovered = hoveredIncident?._id === incident._id;

              return (
                <Marker
                  key={`dst-${idx}`}
                  coordinates={[incident.location.lng, incident.location.lat]}
                  onClick={() => handleIncidentClick(incident)}
                  onMouseEnter={() => setHoveredIncident(incident)}
                  onMouseLeave={() => setHoveredIncident(null)}
                  className="cursor-pointer group"
                >
                  {/* Node Target */}
                  <circle r={isHovered || isSelected ? 4 : 2} fill={incident.color} filter="url(#glow)" className="transition-all duration-300" />
                  {/* Pulse effect for critical or selected */}
                  {(incident.severity === 'critical' || isSelected) && (
                    <circle r={isSelected ? 10 : 8} fill="none" stroke={incident.color} strokeWidth={0.5} className="animate-ping opacity-20" />
                  )}
                </Marker>
              );
            })}
          </ComposableMap>
        </div>

        {/* Incident Dossier Modal */}
        <AnimatePresence>
          {selectedIncident && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIncident(null)} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                className="relative w-full max-w-md bg-[#08080a] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
              >
                {/* Dossier Header */}
                <div className="h-1 bg-red-600 w-full" style={{ backgroundColor: selectedIncident.color }} />
                <div className="p-6 border-b border-white/5 flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <div className="p-4 bg-white/[0.03] border border-white/10 text-white/80">
                      <Database size={24} />
                    </div>
                    <div>
                      <div className="text-[9px] font-black tracking-[0.3em] text-gray-500 uppercase mb-1.5">Classified_Intelligence_Packet</div>
                      <h3 className="text-xl font-black uppercase text-white leading-none tracking-tight">
                        {selectedIncident.type}
                      </h3>
                    </div>
                  </div>
                  <button onClick={() => setSelectedIncident(null)} className="p-1.5 hover:bg-white/10 rounded-full transition-all">
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-px bg-white/5">
                  {[
                    { label: 'Threat_ID', value: selectedIncident._id?.slice(-12).toUpperCase() },
                    { label: 'Severity', value: selectedIncident.severity, color: selectedIncident.color },
                    { label: 'Origin_GEO', value: selectedIncident.source?.country },
                    { label: 'Target_Vect', value: selectedIncident.location?.country },
                    { label: 'Payload_Type', value: 'Encrypted_Binary' },
                    { label: 'Status', value: 'Active_Threat' }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#08080a] p-4">
                      <span className="block text-[8px] text-gray-600 uppercase font-black mb-1">{item.label}</span>
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: item.color || '#eee' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-black/50 space-y-6">
                  <div className="bg-red-950/20 border border-red-500/20 p-4 font-mono text-[9px] text-red-500/80">
                    <span className="block mb-1.5 font-black uppercase">System_Heuristics_Analysis:</span>
                    <div>{">"} MATCH_ID_S7: UNKNOWN_SIGNATURE_DETECTED</div>
                    <div>{">"} TRACING_HOPS: 12_NODES_IDENTIFIED</div>
                    <div>{">"} IMPACT_SCORE: (HIGH_VALUE_TARGET)</div>
                    <motion.span className="inline-block w-2 h-3 bg-red-600 ml-1 mb-[-2px]" animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                  </div>

                  {userInfo?.isAdmin && (
                    <button
                      onClick={handleDeployCountermeasure}
                      className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 group"
                    >
                      <Shield size={16} className="group-hover:rotate-12 transition-transform" />
                      Deploy_Active_Countermeasure
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ThreadMap;
