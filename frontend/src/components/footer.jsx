import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Activity,
  Globe,
  Lock,
  Terminal,
  ChevronRight,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Cpu
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#050505] text-white pt-20 pb-10 overflow-hidden border-t border-white/05">
      {/* Background Tech Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-900/10 to-transparent" />
      </div>

      {/* Top Animated Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10">
        <motion.div
          className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500 to-transparent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center space-x-2 group w-fit">
              <div className="relative">
                <Shield className="w-8 h-8 text-red-500" />
                <motion.div
                  className="absolute inset-0 border border-red-500 rounded-sm opacity-50"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">
                Check<span className="text-red-500">Mate</span>
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed font-mono">
              Advanced cyber defense orchestration system.
              Protecting global infrastructure through autonomous
              threat neutralization and real-time intelligence vectors.
            </p>

            <div className="flex items-center gap-4 pt-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -2, color: "#ef4444" }}
                  className="p-2 bg-white/05 border border-white/05 rounded hover:border-red-500/50 transition-colors text-gray-400"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Matrices */}
          <div className="md:col-span-2 md:col-start-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Dashboard", path: "/admin/dashboard" },
                { label: "Threat Map", path: "/threat-intelligence" },
                { label: "Systems", path: "/services" },
                { label: "Protocols", path: "/solutions" }
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Resources */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
              <Lock className="w-3 h-3" /> Compliance
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", tab: "privacy" },
                { label: "Terms of Service", tab: "terms" },
                { label: "SLA Agreement", tab: "sla" },
                { label: "Security Audit", tab: "audit" }
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to="/compliance"
                    state={{ tab: item.tab }}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors font-mono"
                  >
                    [{item.label}]
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Status Module */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
              <Activity className="w-3 h-3" /> System Status
            </h3>

            <div className="p-4 bg-black/40 border border-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase text-gray-500">Grid Status</span>
                <span className="text-[10px] font-bold uppercase text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Operational
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Traffic Load", val: "42%" },
                  { label: "Threat Level", val: "Low" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[9px] uppercase font-mono text-gray-400">
                      <span>{stat.label}</span>
                      <span className="text-white">{stat.val}</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: "0%" }}
                        animate={{ width: i === 0 ? "42%" : "20%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="ENTER ENCRYPTED CHANNEL..."
                className="w-full bg-white/05 border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-red-500 text-white font-mono placeholder:text-gray-600"
              />
              <button className="absolute right-1 top-1 bottom-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded-sm transition-colors text-[10px] font-bold uppercase tracking-wider">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom: Technical Data */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-500 uppercase">
          <p>© 2025 CHECKMATE SECURITY SUITE. v2.4.0-alpha</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Region: US-EAST-1
            </span>
            <span className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              Latency: 12ms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
