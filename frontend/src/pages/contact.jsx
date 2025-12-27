import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Send,
  Shield,
  Terminal,
  Globe,
  Mail,
  Clock,
  MapPin,
  Cpu,
  Zap,
  ChevronRight,
  Database,
  Activity
} from "lucide-react";

const TacticalLabel = ({ label, value }) => (
  <div className="flex flex-col mb-4">
    <span className="text-[10px] text-red-500/70 font-mono tracking-[0.2em] uppercase mb-1">{label}</span>
    <span className="text-sm text-gray-300 font-mono font-bold tracking-wider">{value}</span>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate tactical uplink
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Tactical Uplink Established:", formData);
    setIsSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-gray-200 relative overflow-hidden font-sans">
      {/* Background Cyber Infrastructure */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(185,28,28,0.08),transparent_70%)]" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Animated Scanning Line */}
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-red-600/20 shadow-[0_0_15px_rgba(220,38,38,0.5)] z-10"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center space-x-2 text-red-500 mb-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Status: Connection_Stable</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              Comm_Center<span className="text-red-600">.</span>
            </h1>
            <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-widest">
              Establish secure uplink with CheckMate central command
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center space-x-4 font-mono text-[10px] text-gray-500 uppercase">
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Encrypted_TLS_1.3</span>
            </div>
            <div className="hidden sm:block">Node_ID: CM-772-B</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form - Left Section */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl relative group overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-600" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 group-hover:border-red-600/50 transition-colors" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 group-hover:border-red-600/50 transition-colors" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-600" />

              <div className="flex items-center space-x-3 mb-8">
                <Terminal className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider italic">Direct_Signal_Uplink</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest px-1">Operator_Identity</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Full Name / Codename"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest px-1">Secure_Contact_Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="operator@secure.net"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest px-1">Uplink_Payload (Message)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Enter support request or intelligence briefing..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className={`w-full py-4 rounded-xl flex items-center justify-center space-x-3 transition-all font-bold uppercase tracking-widest text-sm
                    ${isSuccess
                      ? 'bg-emerald-600 text-white cursor-default'
                      : isSubmitting
                        ? 'bg-red-600/30 text-red-500 cursor-wait'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="submitting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-3"
                      >
                        <Activity className="w-5 h-5 animate-spin" />
                        <span>Initializing_Uplink...</span>
                      </motion.div>
                    ) : isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-3"
                      >
                        <Zap className="w-5 h-5" />
                        <span>Signal_Received_Securely</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-3"
                      >
                        <Send className="w-5 h-5" />
                        <span>Transmit_Signal</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </motion.div>

            {/* Technical Notice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start space-x-4">
                <Shield className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Zero_Log_Protocol</h4>
                  <p className="text-gray-500 text-[10px] leading-relaxed">
                    All communications are encrypted and purged after resolution according to Protocol-9 security standards.
                  </p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start space-x-4">
                <Cpu className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Automated_Triaging</h4>
                  <p className="text-gray-500 text-[10px] leading-relaxed">
                    Artificial Intelligence monitors this uplink 24/7 to categorize threats and prioritize high-vulnerability reports.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Section */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              className="bg-[#0A0A0A]/50 border border-white/10 rounded-2xl p-8 overflow-hidden relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-[60px] -mr-16 -mt-16" />

              <div className="flex items-center space-x-3 mb-8">
                <Activity className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider italic">Node_Metadata</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-8 mb-8">
                <TacticalLabel label="HQ_Coordinates" value="40.7128° N, 74.0060° W" />
                <TacticalLabel label="Node_Uptime" value="99.9997%" />
                <TacticalLabel label="Avg_Response_Latency" value="14.2ms" />
                <TacticalLabel label="Active_Defensive_Protocols" value="24" />
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Global_Headquarters</span>
                    <p className="text-gray-300 font-mono text-sm leading-relaxed">Checking_Sector 7G, CyberSec Plaza<br />Zero-Point District, Virtual Core</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Digital_Drop_Box</span>
                    <p className="text-gray-300 font-mono text-sm">intel@thecheckmate.secure</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Monitor_Hours</span>
                    <p className="text-gray-300 font-mono text-sm">24/7/365 Non-Stop Vigilance</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Strategic Intelligence Feed */}
            <div className="bg-[#0A0A0A]/50 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center space-x-2">
                  <Database className="w-4 h-4 text-red-500" />
                  <span>Strategic_Intelligence_Feed</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-500 animate-pulse">LIVE</span>
              </div>
              <div className="space-y-3 font-mono text-[10px]">
                {[
                  { time: '14:22:01', msg: 'Anomaly detected in Sector 4-B' },
                  { time: '14:21:55', msg: 'System patch 1.2.9 deployed' },
                  { time: '14:20:12', msg: 'Firewall integrity validated' },
                  { time: '14:18:44', msg: 'New operator uplink established' }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-3 text-gray-500 border-l border-white/10 pl-3">
                    <span className="text-red-900/50">{item.time}</span>
                    <span className="group-hover:text-gray-300 transition-colors">{item.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Quick Access */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-red-600/10 group transition-all">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-500 transition-colors">Emergency_Encryption_Guide</span>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-red-500 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-red-600/10 group transition-all">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-500 transition-colors">Vulnerability_Report_Protocol</span>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
