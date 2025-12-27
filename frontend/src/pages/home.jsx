import React, { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import { BASE_URL } from "../redux/constants";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Shield, ChevronRight, Activity, Zap, Globe } from "lucide-react";

// Using the generated high-tech hero background
import HeroVisuals from "@/components/home/HeroVisuals";

// Lazy load heavy components for better initial load performance
const TrustedCompanies = React.lazy(() => import("@/components/home/trustedCompanies"));
const Feature = React.lazy(() => import("@/components/home/feature"));
const LiveMap = React.lazy(() => import("@/components/home/liveMap"));
const Malware = React.lazy(() => import("@/components/home/malware"));

const Home = () => {
  const trustedCompaniesRef = useRef(null);
  const featureRef = useRef(null);
  const liveMapRef = useRef(null);
  const malwareRef = useRef(null);

  const [stats, setStats] = useState({
    uptime: "99.99%",
    activeNodes: "14,802",
    threats: "Loading...",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/incidents/attacks-on-this-day`);
        setStats((prev) => ({
          ...prev,
          threats: data.attacksOnThisDay ? data.attacksOnThisDay.toLocaleString() : "0",
        }));
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats((prev) => ({ ...prev, threats: "2.4M" })); // Fallback
      }
    };

    fetchStats();
  }, []);

  const isTrustedCompaniesInView = useInView(trustedCompaniesRef, { once: true, margin: "-100px" });
  // const isFeatureInView = useInView(featureRef, { once: true, margin: "-100px" }); // Unused
  // const isLiveMapInView = useInView(liveMapRef, { once: true, margin: "-100px" }); // Unused
  // const isMalwareInView = useInView(malwareRef, { once: true, margin: "-100px" }); // Unused

  const statItems = [
    { label: "Uptime", val: stats.uptime, icon: Zap },
    { label: "Active Nodes", val: stats.activeNodes, icon: Globe },
    { label: "Threats Deflected", val: stats.threats, icon: Shield }
  ];

  return (
    <div className="bg-[#09090b] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center lg:justify-center justify-start pt-24 lg:pt-8 px-4 overflow-hidden">


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
              {statItems.map((stat, i) => (
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

          {/* Hero Image / Unique Visual - Extracted to component */}
          <HeroVisuals />
        </div>
      </section>

      {/* Sections Wrapper */}
      <div className="relative z-10 bg-[#09090b]">
        <Suspense fallback={
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-red-500/50">
            <Activity className="w-8 h-8 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em]">Loading Modules...</span>
          </div>
        }>
          <motion.div
            ref={trustedCompaniesRef}
            className="py-8 border-y border-white/05 bg-black/20"
            initial={{ opacity: 0 }}
            animate={isTrustedCompaniesInView ? { opacity: 1 } : {}}
          >
            <div className="max-w-7xl mx-auto px-4">
              <TrustedCompanies />
            </div>
          </motion.div>

          <section ref={featureRef} className="py-10 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <Feature />
            </div>
          </section>

          <section ref={liveMapRef} className="py-10 px-4 bg-black/40 border-y border-white/05 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 text-center max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
                  Live Global <span className="text-red-500">Sentinel</span>
                </h2>
                <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">
                  Real-time attack trace and neutralization dashboard.
                </p>
              </div>
              <LiveMap />
            </div>
          </section>

          <section ref={malwareRef} className="py-10 px-4 mb-8">
            <div className="max-w-7xl mx-auto">
              <Malware />
            </div>
          </section>
        </Suspense>
      </div>


    </div>
  );
};

export default Home;
