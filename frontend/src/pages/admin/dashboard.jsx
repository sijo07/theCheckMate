import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import {
  Globe,
  Shield,
  Server,
  Activity,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  useGetAllIncidentsQuery,
  useGetTopTargetedCountriesQuery,
  useGetTopTargetedIndustriesQuery,
} from "../../redux/api/incidentApiSlice";
import Loader from "../../components/loader";


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const {
    data: incidents = [],
    isLoading: loadingIncidents,
    error: errorIncidents,
  } = useGetAllIncidentsQuery();

  const {
    data: topCountries = [],
    isLoading: loadingCountries,
    error: errorCountries,
  } = useGetTopTargetedCountriesQuery();

  const {
    data: topIndustries = [],
    isLoading: loadingIndustries,
    error: errorIndustries,
  } = useGetTopTargetedIndustriesQuery();

  // Calculate additional statistics
  const highSeverityCount =
    incidents.filter((inc) => inc.severity === "High").length || 0;
  const percentHighSeverity = incidents.length
    ? Math.round((highSeverityCount / incidents.length) * 100)
    : 0;

  const stats = [
    {
      title: "Total Incidents",
      value: incidents.length || 0,
      icon: <Shield className="w-6 h-6" />,
      loading: loadingIncidents,
      error: errorIncidents,
      color: "rgba(239, 68, 68, 1)",
      glow: "rgba(239, 68, 68, 0.4)",
    },
    {
      title: "Targeted Sectors",
      value: topIndustries.length || 0,
      icon: <Server className="w-6 h-6" />,
      loading: loadingIndustries,
      error: errorIndustries,
      color: "rgba(59, 130, 246, 1)",
      glow: "rgba(59, 130, 246, 0.4)",
    },
    {
      title: "Active Nodes",
      value: topCountries.length || 0,
      icon: <Globe className="w-6 h-6" />,
      loading: loadingCountries,
      error: errorCountries,
      color: "rgba(16, 185, 129, 1)",
      glow: "rgba(16, 185, 129, 0.4)",
    },
    {
      title: "Severity Level",
      value: `${percentHighSeverity}%`,
      icon: <Activity className="w-6 h-6" />,
      loading: loadingIncidents,
      error: errorIncidents,
      color: "rgba(245, 158, 11, 1)",
      glow: "rgba(245, 158, 11, 0.4)",
    },
  ];

  // Cyber Chart Configurations
  const cyberColors = {
    primary: "#ef4444",
    secondary: "#3b82f6",
    accent: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    text: "#9ca3af",
    grid: "rgba(255, 255, 255, 0.05)",
    glows: [
      "rgba(239, 68, 68, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(245, 158, 11, 0.8)",
    ],
  };

  const barDataCountries = {
    labels: topCountries.map((c) => c._id || "Unknown"),
    datasets: [
      {
        label: "ATTACK VOLUME BY NODE",
        data: topCountries.map((c) => c.count),
        backgroundColor: cyberColors.primary,
        borderColor: "rgba(239, 68, 68, 0.5)",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "rgba(239, 68, 68, 0.8)",
      },
    ],
  };

  const barDataIndustries = {
    labels: topIndustries.map((i) => i._id || "Unknown"),
    datasets: [
      {
        label: "SECTOR VULNERABILITY",
        data: topIndustries.map((i) => i.count),
        backgroundColor: cyberColors.secondary,
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "rgba(59, 130, 246, 0.8)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { family: "monospace", size: 10, weight: "bold" },
        },
      },
      tooltip: {
        backgroundColor: "#000",
        titleFont: { family: "monospace", size: 12 },
        bodyFont: { family: "monospace", size: 11 },
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: cyberColors.grid },
        ticks: { color: cyberColors.text, font: { family: "monospace", size: 9 } },
      },
      y: {
        grid: { color: cyberColors.grid },
        ticks: { color: cyberColors.text, font: { family: "monospace", size: 9 } },
      },
    },
  };

  const malwareCount = incidents.reduce((acc, incident) => {
    const malwareType = incident.type || "General";
    acc[malwareType] = (acc[malwareType] || 0) + 1;
    return acc;
  }, {});

  const malwareData = {
    labels: Object.keys(malwareCount),
    datasets: [
      {
        data: Object.values(malwareCount),
        backgroundColor: [
          "#c43c3c", // Red
          "#3a75c4", // Blue
          "#715ac5", // Purple
          "#1a9664", // Green
          "#8b5cf6",
        ],
        borderColor: "#111111",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#fff",
          usePointStyle: false,
          boxWidth: 40,
          boxHeight: 12,
          padding: 20,
          font: { family: "monospace", size: 9, weight: "900" },
        },
      },
      tooltip: {
        backgroundColor: "#111",
        titleFont: { family: "monospace" },
        bodyFont: { family: "monospace" },
        cornerRadius: 4,
      }
    },
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8 font-mono relative overflow-hidden">
      {/* Breadcrumb */}
      <nav className="relative z-10 max-w-7xl mx-auto mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
        <Link to="/" className="hover:text-red-500 transition-colors">HQ_HOME</Link>
        <span>/</span>
        <span className="text-red-500/50">ADMIN_CORE</span>
        <span>/</span>
        <span className="text-red-500">DASHBOARD_V4</span>
      </nav>

      {/* HUD Header */}
      <header className="relative z-10 max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/05 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/70">Terminal Override: active</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
            Cyber<span className="text-red-500">Dashboard</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3" />
            LIVE THREAT INTELLIGENCE STREAM // ROOT ACCESS GRANTED
          </p>
        </div>

        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/05 border border-white/10 rounded-lg text-right hidden sm:block">
            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mb-1">System Uptime</p>
            <p className="text-sm font-black text-red-500 tracking-tighter">99.982%</p>
          </div>
          <div className="px-4 py-2 bg-white/05 border border-white/10 rounded-lg text-right">
            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mb-1">Node identifier</p>
            <p className="text-sm font-black text-white tracking-tighter uppercase">CHK-MT-729</p>
          </div>
        </div>
      </header>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative p-6 rounded-xl card-glass border border-white/05 group hover:border-red-500/30 transition-all overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Scanline effect on card */}
              <div className="absolute top-0 left-0 w-full h-px bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)] -translate-y-[100%] group-hover:translate-y-[400%] transition-transform duration-1000 pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg border border-white/10"
                  style={{ backgroundColor: `${stat.color.replace('1)', '0.1)')}`, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.title}</p>
                  <p className="text-2xl font-black text-white tracking-tighter">
                    {stat.loading ? "..." : stat.value}
                  </p>
                </div>
              </div>

              {/* Mini Sparkline Visualization (Placeholder) */}
              <div className="h-1 bg-white/05 rounded-full overflow-hidden mt-2">
                <motion.div
                  className="h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* Attack Volume Chart */}
          <motion.div
            className="lg:col-span-8 p-6 rounded-xl card-glass border border-white/05 relative overflow-hidden group"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Inter-Node Threat Pulse
              </h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 border border-white/20" />
                <div className="w-2 h-2 border border-white/20" />
              </div>
            </div>
            <div className="h-[350px]">
              <Bar data={barDataCountries} options={barOptions} />
            </div>
          </motion.div>

          {/* Sector Vulnerability Chart */}
          <motion.div
            className="lg:col-span-12 xl:col-span-4 p-12 rounded-3xl bg-[#222222] border border-white/05 relative overflow-hidden shadow-2xl"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-10 text-center">
              Infrastructure Risk Profile
            </h3>
            <div className="h-[350px] relative flex items-center justify-center">
              <Pie data={malwareData} options={pieOptions} />
              {/* Decorative HUD Circle Overlays */}
              <div className="absolute inset-0 border-[30px] border-white/02 rounded-full pointer-events-none scale-[0.85] opacity-40 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />
              <div className="absolute inset-0 border border-white/05 rounded-full pointer-events-none scale-95" />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Sector Vulnerability Table (Previously another bar chart) */}
        <motion.div
          className="p-6 rounded-xl card-glass border border-white/05 relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">
              Secondary Sector Analysis
            </h3>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-white/10 to-transparent mx-6" />
          </div>
          <div className="h-[300px]">
            <Bar data={barDataIndustries} options={barOptions} />
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Glitch Overlay (Subtle) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] cyber-grid" />

      {/* Background Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-1/2 h-1/2 bg-red-500/05 blur-[200px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-1/2 h-1/2 bg-blue-500/05 blur-[200px] pointer-events-none" />
    </div>
  );
};

export default Dashboard;
