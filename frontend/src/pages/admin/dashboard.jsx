import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, Doughnut } from "react-chartjs-2";
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
  } = useGetAllIncidentsQuery();

  const {
    data: topCountries = [],
  } = useGetTopTargetedCountriesQuery();

  const {
    data: topIndustries = [],
  } = useGetTopTargetedIndustriesQuery();

  const highSeverityCount = incidents.filter((inc) => inc.severity === "High").length || 0;
  const percentHighSeverity = incidents.length ? Math.round((highSeverityCount / incidents.length) * 100) : 0;

  const stats = [
    { label: "NET_CAPACITY", value: "1.24 PB/s", color: "text-blue-800", icon: Wifi },
    { label: "ENC_STRENGTH", value: "AES_256", color: "text-purple-800", icon: Lock },
    { label: "NODE_STABILITY", value: "99.98%", color: "text-emerald-800", icon: Server },
    { label: "THREAT_DETECTION", value: "REAL_TIME", color: "text-red-800", icon: Shield },
  ];

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#000",
        titleFont: { family: "monospace", size: 10 },
        bodyFont: { family: "monospace", size: 10 },
        borderColor: "rgba(239, 68, 68, 0.4)",
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#666", font: { size: 8, family: "monospace" } } },
      y: { grid: { color: "rgba(239, 68, 68, 0.05)" }, ticks: { color: "#666", font: { size: 8, family: "monospace" } } },
    },
  };

  const barDataCountries = {
    labels: topCountries.map((c) => c._id?.substring(0, 3).toUpperCase() || "UNK"),
    datasets: [{
      data: topCountries.map((c) => c.count),
      backgroundColor: "rgba(153, 27, 27, 0.6)",
      borderColor: "rgba(185, 28, 28, 0.4)",
      borderWidth: 1,
      barThickness: 10,
    }],
  };

  const malwareData = {
    labels: ["DDoS", "Malware", "Phishing", "Ransomware"],
    datasets: [{
      data: [35, 25, 20, 20],
      backgroundColor: [
        "rgba(185, 28, 28, 0.6)", // Deep Red
        "rgba(30, 58, 138, 0.6)", // Deep Blue
        "rgba(6, 78, 59, 0.6)",   // Deep Emerald
        "rgba(88, 28, 135, 0.6)", // Deep Purple
      ],
      hoverBackgroundColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 0,
      spacing: 2,
    }],
  };

  return (
    <div className="min-h-screen bg-[#050506] text-gray-400 p-4 md:p-6 font-mono selection:bg-red-500/30 overflow-hidden relative">
      {/* Background Cyber Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-[#050506]" />
      </div>

      {/* Scanning Line */}
      <motion.div
        className="fixed left-0 right-0 h-[100px] bg-red-900/05 z-0 pointer-events-none border-y border-red-900/10"
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header HUD */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b border-white/05 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-red-800 rounded-sm rotate-45 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-900">System_Admin // Node: CHK-MT-09</span>
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">
              Command_<span className="text-red-900">Center</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-4">
            {stats.map((s, i) => (
              <div key={i} className="px-5 py-2 bg-white/02 border border-white/05 rounded-lg">
                <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2">
                  <s.icon size={8} className={s.color} /> {s.label}
                </p>
                <p className="text-xs font-black text-white tracking-widest">{s.value}</p>
              </div>
            ))}
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[750px]">

          {/* LEFT: Operational Status (Col 3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <section className="flex-1 bg-white/02 border border-white/05 rounded-2xl p-6 relative overflow-hidden flex flex-col decoration-none">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2">
                <Cpu size={12} className="text-blue-500" /> Operational_Node_Matrix
              </h3>
              <div className="grid grid-cols-6 gap-2 mb-8">
                {Array.from({ length: 48 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-2 rounded-sm ${i % 7 === 0 ? 'bg-red-900/40 shadow-[0_0_8px_#991b1b40]' : 'bg-emerald-500/20'}`}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                  />
                ))}
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {[
                  { label: "Global Traffic", val: "482 GB/s", status: "Nominal" },
                  { label: "Active Probes", val: "1,204", status: "Intercepted" },
                  { label: "Enc Handshakes", val: "42k/m", status: "Secure" },
                  { label: "Kernel Load", val: "24.2%", status: "Optimum" },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-black/40 border border-white/05 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-gray-600 uppercase">{item.label}</span>
                      <span className="text-[8px] text-emerald-500 italic uppercase tracking-widest">{item.status}</span>
                    </div>
                    <div className="text-sm font-black text-white">{item.val}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="h-48 bg-red-900/05 border border-red-900/10 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-800 mb-4">Lethality_Scale</h3>
              <div className="flex items-center gap-6 h-full pb-8">
                <div className="text-4xl font-black text-white italic">0.28</div>
                <div className="flex-1 h-3 bg-white/05 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-red-800 shadow-[0_0_15px_#991b1b]"
                    initial={{ width: 0 }}
                    animate={{ width: "28%" }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* CENTER: Data Core (Col 6) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <section className="flex-1 bg-white/02 border border-white/05 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <Globe size={200} />
              </div>
              <div className="flex justify-between items-start mb-8 text-none">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2 mb-1">
                    <Activity size={12} className="text-red-800" /> Inter-Node_Threat_Pulse
                  </h3>
                  <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest italic">Temporal Attack Volumetrics</span>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Total_Signals</p>
                    <p className="text-lg font-black text-white">{incidents.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Crit_Impact</p>
                    <p className="text-lg font-black text-red-800">{highSeverityCount}</p>
                  </div>
                </div>
              </div>
              <div className="h-[300px] mb-8">
                <Bar data={barDataCountries} options={barOptions} />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 bg-white/02 border border-white/05 rounded-2xl">
                  <p className="text-[9px] text-gray-600 font-bold uppercase mb-2 italic">Threat_DNA</p>
                  <div className="text-xs font-black text-white flex items-center justify-between">
                    <span>VOLATILITY</span>
                    <span className="text-red-800">HIGH</span>
                  </div>
                </div>
                <div className="p-4 bg-white/02 border border-white/05 rounded-2xl">
                  <p className="text-[9px] text-gray-600 font-bold uppercase mb-2 italic">Sector_Risk</p>
                  <div className="text-xs font-black text-white flex items-center justify-between">
                    <span>DYNAMIC</span>
                    <span className="text-blue-500">42.2%</span>
                  </div>
                </div>
                <div className="p-4 bg-white/02 border border-white/05 rounded-2xl">
                  <p className="text-[9px] text-gray-600 font-bold uppercase mb-2 italic">Def_Active</p>
                  <div className="text-xs font-black text-white flex items-center justify-between">
                    <span>READY</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:h-48 bg-white/02 border border-white/05 rounded-2xl p-6 relative overflow-hidden flex items-center gap-8">
              <div className="w-32 h-32 flex-shrink-0 relative group/chart">
                {/* Perimeter Radar Ticks */}
                <div className="absolute inset-[-10px] pointer-events-none opacity-20 group-hover/chart:opacity-40 transition-opacity">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 30}deg) translateY(-60px)`
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  className="w-full h-full relative z-10"
                  initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <Doughnut data={malwareData} options={doughnutOptions} />
                </motion.div>

                {/* Central HUD Core */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <motion.span
                    className="text-xl font-black text-white italic leading-none"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    28%
                  </motion.span>
                  <span className="text-[7px] font-bold text-red-800 uppercase tracking-widest mt-1">THREAT_LVL</span>
                </div>

                <div className="absolute inset-0 border-4 border-white/05 rounded-full scale-110" />
              </div>
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {malwareData.labels.map((label, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[8px] text-gray-600 font-bold uppercase mb-1">{label}</p>
                    <p className="text-sm font-black text-white italic">{malwareData.datasets[0].data[i]}%</p>
                    <div className="w-8 h-1 mx-auto mt-2" style={{ backgroundColor: malwareData.datasets[0].backgroundColor[i] }} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: System Telemetry (Col 3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <section className="flex-1 bg-white/02 border border-white/05 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2">
                <Terminal size={12} className="text-red-800" /> Active_Threat_DNA
              </h3>
              <div className="space-y-3 overflow-hidden">
                {incidents.slice(0, 8).map((inc, i) => (
                  <div key={i} className="flex flex-col border-b border-white/05 pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-black text-red-800/70 truncate w-2/3 uppercase">{inc.title}</span>
                      <span className="text-[7px] text-gray-700 italic">{inc.severity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white truncate max-w-[120px] uppercase">0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-0.5 bg-red-400" />
                        <div className="w-2 h-0.5 bg-gray-800" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-6 left-6 right-6 pt-4 border-t border-white/05 flex justify-between items-center">
                <span className="text-[8px] font-bold text-gray-700 uppercase">Live_Ingestion_Active</span>
                <Download size={10} className="text-gray-700 animate-bounce" />
              </div>
            </section>

            <section className="h-48 bg-white/02 border border-white/05 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border border-red-900/20 rounded flex items-center justify-center text-red-800">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-0.5 italic">Energy_Output</p>
                  <p className="text-xl font-black text-white italic">482.4 GW/h</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[8px] text-gray-700 font-bold uppercase tracking-widest">
                  <span>Load: 42%</span>
                  <span>Optimum</span>
                </div>
                <div className="h-1 bg-white/05 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[42%]" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Sidebar Data Strip */}
      <div className="fixed top-0 right-0 w-1 h-full bg-red-900/10 z-50 overflow-hidden">
        <motion.div
          className="w-full h-20 bg-red-900 shadow-[0_0_20px_#991b1b]"
          animate={{ top: ["-20%", "120%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Bottom HUD Metadata */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/05 py-2 px-6 z-50 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-gray-600">
        <div className="flex gap-8">
          <span>Terminal: /dev/tty0</span>
          <span className="text-emerald-500/50">ENC: AES_256_ACTIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-red-900/50 animate-pulse">!! SECURITY_TAMPER_DETECTED !!</span>
          <span>© 2025 CHECK_MATE OS v4.2.0</span>
        </div>
      </div>
    </div>
  );
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "85%",
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#000",
      titleFont: { family: "monospace", size: 10 },
      bodyFont: { family: "monospace", size: 10 },
      borderColor: "rgba(239, 68, 68, 0.2)",
      borderWidth: 1,
    },
  },
};

export default Dashboard;
