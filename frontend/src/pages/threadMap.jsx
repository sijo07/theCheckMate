import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  MapPin,
  List,
} from "lucide-react";
import {
  useGetAllIncidentsQuery,
} from "../redux/api/incidentApiSlice";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mapStyles = `
  @keyframes beam-flow {
    0% {
      stroke-dashoffset: 100;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 0;
    }
  }
  @keyframes blast-wave {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  .animated-beam {
    animation: beam-flow 1s linear infinite;
    filter: drop-shadow(0 0 3px #ef4444);
  }
  .blast-effect {
    transform-origin: center;
    animation: blast-wave 2s infinite ease-out;
  }
  .map-frame {
    background: #09090b;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
  }
  .map-top-bar {
    height: 32px;
    background: linear-gradient(to bottom, #1c1c1e, #09090b);
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    display: flex;
    items-center: center;
    px: 12px;
  }
`;

// Helper to determine threat level from type
const getSeverityFromType = (type) => {
  const map = {
    'Ransomware': 'critical',
    'DDoS': 'critical',
    'Malware': 'high',
    'Unauthorized Access': 'high',
    'Phishing': 'medium',
    'Exploits': 'medium',
  };
  return map[type] || 'low';
};

const enrichIncident = (inc) => {
  return {
    ...inc,
    severity: inc.severity || getSeverityFromType(inc.type),
    status: inc.status || 'active',
  };
};

const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical': return 'bg-red-500 text-red-500';
    case 'high': return 'bg-orange-500 text-orange-500';
    case 'medium': return 'bg-yellow-500 text-yellow-500';
    case 'low': return 'bg-blue-500 text-blue-500';
    default: return 'bg-gray-500 text-gray-500';
  }
};

const ThreadMap = () => {
  // Data State
  const [realtimeIncidents, setRealtimeIncidents] = useState([]);

  // Filter State
  const [selectedSeverities, setSelectedSeverities] = useState(['critical', 'high', 'medium', 'low']);
  const [selectedStatuses, setSelectedStatuses] = useState(['active', 'investigating']);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // RTK Query (Refreshed)
  const { data: incidentsData, isLoading } = useGetAllIncidentsQuery();

  // Load Data and Socket
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('new-incident', (incident) => {
      setRealtimeIncidents(prev => [enrichIncident(incident), ...prev].slice(0, 50));
    });
    return () => socket.disconnect();
  }, []);

  const incidents = useMemo(() => {
    const base = Array.isArray(incidentsData) ? incidentsData : [];
    const combined = [...realtimeIncidents, ...base.map(enrichIncident)];
    // Deduplicate by ID
    return Array.from(new Map(combined.map(item => [item._id, item])).values());
  }, [incidentsData, realtimeIncidents]);

  // Filtering
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc =>
      selectedSeverities.includes(inc.severity?.toLowerCase()) &&
      selectedStatuses.includes(inc.status?.toLowerCase())
    );
  }, [incidents, selectedSeverities, selectedStatuses]);

  const toggleSeverity = (sev) => {
    setSelectedSeverities(prev => prev.includes(sev) ? prev.filter(s => s !== sev) : [...prev, sev]);
  };

  const toggleStatus = (stat) => {
    setSelectedStatuses(prev => prev.includes(stat) ? prev.filter(s => s !== stat) : [...prev, stat]);
  };

  // Get set of active countries for highlighting
  const activeCountries = useMemo(() => {
    return new Set(filteredIncidents.map(i => i.location?.country).filter(Boolean));
  }, [filteredIncidents]);

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#111112] text-red-500 uppercase tracking-widest font-bold">Initializing Command Center...</div>;

  return (
    <div className="min-h-screen bg-[#111112] text-white pt-4 px-4 sm:px-6 lg:px-8 pb-8 font-mono relative overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="cyber-grid" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase line-height-tight">
            Threat <span className="text-red-500">Live Monitor</span>
          </h2>
          <p className="text-gray-600 mt-1 text-[10px] font-bold uppercase tracking-[0.3em]">
            Status: Connection Secure // Protocol: Delta-Six
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          {/* Legend */}
          <div className="hidden md:flex card-glass border border-white/05 px-6 py-2 rounded-full gap-6 items-center shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Medium</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </div>
            Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {/* Filters Card */}
        <div className="card-glass h-fit lg:col-span-1 p-6 rounded-2xl">
          <div className="flex items-center gap-2 text-red-500 mb-6 font-black text-[10px] uppercase tracking-[0.3em]">
            <Filter className="w-3 h-3" /> System Subroutines
          </div>

          <div className="space-y-8">
            {/* Severity */}
            <div className="space-y-4">
              <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Severity Tier</p>
              {['critical', 'high', 'medium', 'low'].map((severity) => (
                <div key={severity} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`severity-${severity}`}
                      checked={selectedSeverities.includes(severity)}
                      onChange={() => toggleSeverity(severity)}
                      className="w-4 h-4 rounded-sm border border-white/10 bg-black/40 checked:bg-red-500 checked:border-red-500 focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none transition-all"
                    />
                    <label htmlFor={`severity-${severity}`} className="flex items-center gap-2 text-[11px] text-gray-400 cursor-pointer group-hover:text-white transition-colors uppercase font-bold tracking-wider">
                      <span className={`w-1 h-1 rounded-full ${getSeverityColor(severity).split(' ')[0]}`}></span>
                      {severity}
                    </label>
                  </div>
                  <span className="text-[9px] text-gray-700 font-bold">
                    {incidents.filter(i => i.severity?.toLowerCase() === severity).length}
                  </span>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="space-y-4">
              <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Global Status</p>
              {['active', 'investigating', 'contained', 'resolved'].map((status) => (
                <div key={status} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                      className="w-4 h-4 rounded-sm border border-white/10 bg-black/40 checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none transition-all"
                    />
                    <label htmlFor={`status-${status}`} className="text-[11px] text-gray-400 cursor-pointer group-hover:text-white transition-colors uppercase font-bold tracking-wider">
                      {status}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Card */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="relative w-full aspect-[4/3] sm:aspect-video map-frame overflow-hidden flex flex-col shadow-2xl">

            {/* Map Header Overlay */}
            <div className="absolute top-[10px] left-4 flex items-center gap-2 z-20 pointer-events-none">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]" />
              <h1 className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-black">
                Orbital Surveillance
              </h1>
            </div>

            {/* Hover Tooltip */}
            <AnimatePresence>
              {hoveredCountry && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-12 md:top-4 left-1/2 -translate-x-1/2 z-30 bg-[#0f0f10]/80 border border-red-500/20 px-6 py-2 rounded-lg pointer-events-none backdrop-blur-md"
                >
                  <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    Region: {hoveredCountry}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Map Implementation */}
            <style>{mapStyles}</style>
            <div className="flex-1 relative w-full h-full bg-[#09090b]">
              <div className="map-top-bar" />
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 140,
                  center: [0, 15]
                }}
                viewBox="0 0 800 450"
                width={800}
                height={450}
                className="w-full h-full outline-none"
              >
                <defs>
                  <pattern id="dotPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.8" fill="white" fillOpacity="0.2" />
                  </pattern>
                </defs>

                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={activeCountries.has(geo.properties.name) ? "rgba(239, 68, 68, 0.2)" : "url(#dotPattern)"}
                        stroke={activeCountries.has(geo.properties.name) ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.1)"}
                        strokeWidth={0.5}
                        onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "rgba(255,255,255,0.05)", outline: "none", cursor: "crosshair" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* Threat Lines */}
                {filteredIncidents.map((incident, idx) => {
                  const srcLat = incident.source?.lat;
                  const srcLng = incident.source?.lng;
                  const dstLat = (incident.location?.lat || incident.lat);
                  const dstLng = (incident.location?.lng || incident.lng);

                  if (!srcLat || !srcLng || !dstLat || !dstLng) return null;
                  if (Math.abs(srcLat - dstLat) < 0.1 && Math.abs(srcLng - dstLng) < 0.1) return null;

                  return (
                    <React.Fragment key={`line-${incident._id || idx}`}>
                      <Line
                        from={[srcLng, srcLat]}
                        to={[dstLng, dstLat]}
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        strokeOpacity={0.03}
                        curve={0.5}
                      />
                      <Line
                        from={[srcLng, srcLat]}
                        to={[dstLng, dstLat]}
                        stroke="#ef4444"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeDasharray="1 100"
                        curve={0.5}
                        className="animated-beam"
                        style={{ animationDuration: '3s' }}
                      />
                    </React.Fragment>
                  );
                })}

                {/* Markers */}
                {filteredIncidents.map((incident, idx) => {
                  const srcLat = incident.source?.lat;
                  const srcLng = incident.source?.lng;
                  const dstLat = (incident.location?.lat || incident.lat);
                  const dstLng = (incident.location?.lng || incident.lng);

                  if (!dstLat || !dstLng) return null;

                  const colorClass = getSeverityColor(incident.severity);
                  const colorHex = colorClass.includes('red') ? '#ef4444' :
                    colorClass.includes('orange') ? '#ef4444' :
                      colorClass.includes('yellow') ? '#eab308' : '#3b82f6';

                  return (
                    <React.Fragment key={`mark-${incident._id || idx}`}>
                      {/* Source Marker */}
                      {srcLat && srcLng && (
                        <Marker coordinates={[srcLng, srcLat]}>
                          <circle r="1.5" fill="#94a3b8" opacity="0.5" />
                          <circle r="4" fill="#94a3b8" opacity="0.05" />
                        </Marker>
                      )}
                      {/* Target Marker */}
                      <Marker coordinates={[dstLng, dstLat]}>
                        <circle r="2.5" fill={colorHex} className="shadow-lg" />
                        <circle r="6" stroke={colorHex} fill="none" className="blast-effect" style={{ animationDelay: '0s' }} />
                        <circle r="6" stroke={colorHex} fill="none" className="blast-effect" style={{ animationDelay: '1s' }} />
                      </Marker>
                    </React.Fragment>
                  );
                })}
              </ComposableMap>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadMap;
