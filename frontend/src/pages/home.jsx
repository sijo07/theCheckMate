import React, { useRef } from "react";
import { Link } from "react-router-dom";
import TrustedCompanies from "@/components/home/trustedCompanies";
import Feature from "@/components/home/feature";
import LiveMap from "@/components/home/liveMap";
import Malware from "@/components/home/malware";
import { motion, useInView } from "framer-motion";
import { Shield, ChevronRight, Activity, Lock, Zap, Globe } from "lucide-react";

// Using the generated high-tech hero background
import heroImage from "../assets/hero_red.png";

const Home = () => {
  const trustedCompaniesRef = useRef(null);
  const featureRef = useRef(null);
  const liveMapRef = useRef(null);
  const malwareRef = useRef(null);

  const isTrustedCompaniesInView = useInView(trustedCompaniesRef, { once: true, margin: "-100px" });
  const isFeatureInView = useInView(featureRef, { once: true, margin: "-100px" });
  const isLiveMapInView = useInView(liveMapRef, { once: true, margin: "-100px" });
  const isMalwareInView = useInView(malwareRef, { once: true, margin: "-100px" });

  return (
    <div className="bg-[#09090b] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center lg:pt-0 pt-4 px-4 overflow-hidden">


        {/* Main Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Activity className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Live Defense Status: Normal</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-none">
              Check<span className="text-red-500">Mate</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-medium">
              Next-generation cyber defense orchestrator.
              Real-time threat monitoring, autonomous remediation,
              and AI-driven cryptographic resilience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/threat-intelligence"
                className="group relative px-8 py-4 bg-red-500 text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] overflow-hidden flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                <span>Initialize Protocol</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 bg-white/05 border border-white/10 hover:border-white/30 rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center"
              >
                Browse Systems
              </Link>
            </div>

            {/* Unique Element: Live Stats Ticker */}
            <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
              {[
                { label: "Uptime", val: "99.99%", icon: Zap },
                { label: "Active Nodes", val: "14,802", icon: Globe },
                { label: "Threats Deflected", val: "2.4M", icon: Shield }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 bg-white/05 rounded-lg border border-white/05">
                    <stat.icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                    <p className="text-lg font-black text-white">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image / Unique Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative z-10 w-full aspect-square md:aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
              <img
                src={heroImage}
                alt="Cyber Defense Command Center"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-60" />

              {/* Floating UI Elements */}
              <motion.div
                className="absolute top-10 right-10 p-4 card-glass rounded-xl border border-white/10 backdrop-blur-md hidden md:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Core Status: Stable</span>
                </div>
                <div className="space-y-1">
                  <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </div>
                  <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-400"
                      initial={{ width: "0%" }}
                      animate={{ width: "45%" }}
                      transition={{ duration: 2, delay: 1.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-red-500/05 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-white/05 rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Sections Wrapper */}
      <div className="relative z-10 bg-[#09090b]">
        <motion.div
          ref={trustedCompaniesRef}
          className="py-20 border-y border-white/05 bg-black/20"
          initial={{ opacity: 0 }}
          animate={isTrustedCompaniesInView ? { opacity: 1 } : {}}
        >
          <div className="max-w-7xl mx-auto px-4">
            <TrustedCompanies />
          </div>
        </motion.div>

        <section ref={featureRef} className="py-32 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <Feature />
          </div>
        </section>

        <section ref={liveMapRef} className="py-32 px-4 bg-black/40 border-y border-white/05 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                Live Global <span className="text-red-500">Sentinel</span>
              </h2>
              <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">
                Real-time attack trace and neutralization dashboard.
              </p>
            </div>
            <LiveMap />
          </div>
        </section>

        <section ref={malwareRef} className="py-32 px-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <Malware />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-20 bg-black border-t border-white/05 text-center px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-8">
            <Shield className="w-6 h-6 text-red-500" />
            <span className="text-2xl font-black tracking-tighter uppercase text-white">
              Check<span className="text-red-500">Mate</span>
            </span>
          </div>
          <div className="flex gap-8 mb-10 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-red-500 transition-colors">Protocol</a>
            <a href="#" className="hover:text-red-500 transition-colors">Nodes</a>
            <a href="#" className="hover:text-red-500 transition-colors">Encryption</a>
          </div>
          <p className="text-gray-700 text-[9px] font-bold uppercase tracking-[0.3em]">
            &copy; 2025 CHECKMATE SECURITY GROUP // ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
