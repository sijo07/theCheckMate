import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Globe,
  Shield,
  Server,
  Activity,
  Zap,
  Lock,
  Cpu,
  Wifi,
  Terminal,
  AlertCircle,
  Download,
  Crosshair,
  Database,
  Eye,
  Hash
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import {
  useGetAllIncidentsQuery,
  useGetTopTargetedCountriesQuery,
  useGetTopTargetedIndustriesQuery,
} from "../../redux/api/incidentApiSlice";
import Loader from "../../components/loader";

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Styled Components / Sub-Components ---

const CyberCard = ({ children, className = "", title, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`relative bg-[#0a0a0b]/80 backdrop-blur-sm border border-red-900/30 p-6 group overflow-hidden ${className}`}
  >
    {/* Corner Decorations */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />

    {/* Animated Border Glow */}
    <div className="absolute inset-0 border border-red-500/0 group-hover:border-red-500/30 transition-colors duration-500" />

    {/* Header */}
    {(title || Icon) && (
      <div className="flex items-center gap-3 mb-6 border-b border-red-900/20 pb-2">
        {Icon && <Icon className="w-5 h-5 text-red-500 animate-pulse" />}
        {title && (
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-red-500 transition-colors">
            {title}
          </h3>
        )}
      </div>
    )}

    {children}
  </motion.div>
);

const StatPill = ({ label, value, icon: Icon, trend }) => (
  <div className="flex items-center justify-between p-3 bg-white/05 border-l-2 border-red-500/50 hover:border-red-500 transition-all hover:bg-white/10 group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-black/50 rounded text-red-500 group-hover:text-white transition-colors">
        <Icon size={14} />
      </div>
      <div>
        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{label}</div>
        <div className="text-sm font-black text-white font-mono">{value}</div>
      </div>
    </div>
    {trend && (
      <div className={`text-[9px] font-bold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </div>
    )}
  </div>
);

const TerminalLog = () => {
  const [logs, setLogs] = useState([
    "SYS_INIT: Core services loaded...",
    "NET_SEC: Firewall integrity verified [100%]",
    "AUTH: Admin session established",
  ]);

  useEffect(() => {
    const messages = [
      "SCAN: Port 8080 traffic analysis...",
      "WARN: High latency on Node-7",
      "INFO: Database backup completed",
      "SEC: Blocked unauthorized IP 192.168.x.x",
      "API: Incident report ingestion...",
      "CRIT: Packet fragmentation detected",
      "SYS: Memory optimization routine...",
    ];

    const interval = setInterval(() => {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${messages[Math.floor(Math.random() * messages.length)]}`, ...prev].slice(0, 8));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 font-mono text-[10px] p-4 h-full overflow-hidden border border-red-900/30 relative">
      <div className="absolute top-0 right-0 px-2 py-1 bg-red-900/20 text-red-500 text-[8px] font-bold uppercase tracking-widest border-bl border-l border-b border-red-900/30">
        System_Log // Live
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1 - (i * 0.1), x: 0 }}
            className="text-green-500/90 truncate"
          >
            <span className="text-red-500 mr-2">{">"}</span>{log}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Data Queries
  const { data: incidents = [], isLoading: loadingIncidents } = useGetAllIncidentsQuery(undefined, { pollingInterval: 30000 });
  const { data: topCountries = [] } = useGetTopTargetedCountriesQuery();
  const { data: topIndustries = [] } = useGetTopTargetedIndustriesQuery();

  // Mocks/Calculations
  const highSeverityCount = incidents.filter((inc) => inc.severity?.toLowerCase() === "high" || inc.severity?.toLowerCase() === "critical").length || 0;
  const criticalCount = incidents.filter((inc) => inc.severity?.toLowerCase() === "critical").length || 0;

  // Real-time clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Chart Configs ---
  const chartCommonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#050505",
        titleColor: "#ef4444",
        bodyColor: "#fff",
        borderColor: "#333",
        borderWidth: 1,
        titleFont: { family: "monospace", size: 10 },
        bodyFont: { family: "monospace", size: 10 },
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.02)" },
        ticks: { color: "#666", font: { family: "monospace", size: 9 } }
      },
      y: {
        grid: { color: "rgba(255,255,255,0.02)" },
        ticks: { color: "#666", font: { family: "monospace", size: 9 } }
      },
    },
  };

  const incidentsChartData = {
    labels: topCountries.map(c => c._id),
    datasets: [{
      data: topCountries.map(c => c.count),
      backgroundColor: "rgba(239, 68, 68, 0.5)",
      borderColor: "#ef4444",
      borderWidth: 1,
      hoverBackgroundColor: "#ef4444",
    }]
  };

  const severityChartData = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [{
      data: [
        incidents.filter(i => i.severity === 'critical').length,
        incidents.filter(i => i.severity === 'high').length,
        incidents.filter(i => i.severity === 'medium').length,
        incidents.filter(i => i.severity === 'low').length,
      ],
      backgroundColor: ["#ef4444", "#f97316", "#eab308", "#3b82f6"],
      borderColor: "#000",
      borderWidth: 2,
    }]
  };

  return (
    <div className="min-h-screen bg-[#020203] text-gray-300 font-mono relative overflow-hidden pb-12">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(185,28,28,0.05),transparent_70%)]" />
        <div className="w-full h-full opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header Bar */}
      <header className="fixed top-20 left-0 right-0 h-16 bg-[#0a0a0b]/90 backdrop-blur border-b border-red-900/30 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6 text-red-600 animate-pulse" />
          <h1 className="text-lg font-black uppercase tracking-[0.2em] text-white">
            Admin <span className="text-red-600">Console_</span>
          </h1>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <div className="hidden md:flex items-center gap-2">
            <Globe size={12} className="text-blue-500" />
            <span>Net_Status: <span className="text-white">Online</span></span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Server size={12} className="text-emerald-500" />
            <span>Server_Load: <span className="text-white">34%</span></span>
          </div>
          <div className="px-3 py-1 bg-red-900/20 border border-red-900/50 text-red-500 rounded flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            {time.toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-4 lg:pt-24 max-w-[1600px] relative z-10">

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <CyberCard delay={0.1} className="!p-0 border-l-4 border-l-red-600">
            <StatPill label="Total Incidents" value={incidents.length} icon={Database} trend={12} />
          </CyberCard>
          <CyberCard delay={0.2} className="!p-0 border-l-4 border-l-red-600">
            <StatPill label="Critical Alerts" value={criticalCount} icon={AlertCircle} trend={-5} />
          </CyberCard>
          <CyberCard delay={0.3} className="!p-0 border-l-4 border-l-red-600">
            <StatPill label="Active Nodes" value="1,402" icon={Wifi} trend={2} />
          </CyberCard>
          <CyberCard delay={0.4} className="!p-0 border-l-4 border-l-red-600">
            <StatPill label="Sys Integrity" value="99.9%" icon={Shield} />
          </CyberCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Col: Main Chart (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Global Threat Map Visualization (using Bar for now) */}
            <CyberCard title="Global_Threat_Vector_Analysis" icon={Crosshair} className="h-[400px]">
              <div className="h-full pb-8">
                <Bar data={incidentsChartData} options={chartCommonOptions} />
              </div>
            </CyberCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Severity Pulse */}
              <CyberCard title="Severity_Distribution" icon={Activity} className="h-[300px]">
                <div className="h-full pb-6 relative flex items-center justify-center">
                  <Doughnut
                    data={severityChartData}
                    options={{
                      ...chartCommonOptions,
                      cutout: '70%',
                      plugins: { legend: { display: false } }
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-white">{highSeverityCount}</span>
                    <span className="text-[8px] uppercase tracking-widest text-red-500">High_Risk</span>
                  </div>
                </div>
              </CyberCard>

              {/* Live Terminal */}
              <CyberCard title="System_Kernel_Log" icon={Terminal} className="h-[300px] !p-0 overflow-hidden flex flex-col">
                <TerminalLog />
              </CyberCard>
            </div>
          </div>

          {/* Right Col: Lists & Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Top Industries */}
            <CyberCard title="Sector_Vulnerability_Index" icon={Hash}>
              <div className="space-y-4">
                {topIndustries.map((ind, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-white transition-colors">
                        {ind._id}
                      </span>
                      <span className="text-xs font-mono text-red-500">{ind.count}</span>
                    </div>
                    <div className="w-full h-1 bg-white/05 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(ind.count / topIndustries[0].count) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full bg-red-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CyberCard>

            {/* System Health */}
            <CyberCard title="Node_Health_Status" icon={Cpu}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { l: 'CPU_01', v: '42%' },
                  { l: 'CPU_02', v: '38%' },
                  { l: 'MEM_USG', v: '12GB' },
                  { l: 'NET_IO', v: '4Tb' },
                ].map((stat, i) => (
                  <div key={i} className="bg-red-900/10 border border-red-900/20 p-3 text-center">
                    <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">{stat.l}</div>
                    <div className="text-lg font-black text-white">{stat.v}</div>
                  </div>
                ))}
              </div>
            </CyberCard>

            {/* Quick Actions */}
            <CyberCard title="Manual_Override" icon={Lock}>
              <div className="space-y-2">
                <button className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                  <Zap size={12} /> Force_System_Purge
                </button>
                <button className="w-full py-3 bg-white/05 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                  <Download size={12} /> Export_Audit_Log
                </button>
              </div>
            </CyberCard>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
