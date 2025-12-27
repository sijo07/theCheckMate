import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronLeft, Target, Cpu, Activity, Zap } from "lucide-react";

const featureDetails = {
  "real-time-tracking": {
    title: "Real-Time Attack Tracking",
    tagline: "LIVE PROTOCOL // THRE-TRK-V4",
    description:
      "Monitor cyber threats in real-time with live tracking. Get insights into attack sources, patterns, and vulnerabilities before they escalate.",
    benefits: [
      "Live threat monitoring across the globe",
      "Instant alerts for emerging attacks",
      "Interactive visualization of attack patterns",
    ],
    useCases: [
      "Cybersecurity analysts monitoring threats",
      "Organizations enhancing threat defense",
      "Government agencies tracking incidents",
    ],
  },
  "rapid-threat-resolution": {
    title: "Rapid Threat Resolution",
    tagline: "AUTO RESPONSE // RES-SYS-X1",
    description:
      "Respond to cyber threats instantly with AI-powered detection and resolution mechanisms, reducing security risks significantly.",
    benefits: [
      "Automated threat identification and response",
      "Machine learning-based risk assessments",
      "Minimized downtime with proactive security",
    ],
    useCases: [
      "Enterprises preventing data breaches",
      "Financial institutions securing transactions",
      "Cloud service providers enhancing protection",
    ],
  },
  "global-threat-insights": {
    title: "Global Threat Intelligence",
    tagline: "DEEP ANALYSIS // INTEL-GLOBE-9",
    description:
      "Stay ahead of cyber threats with comprehensive intelligence reports, predictive analytics, and deep security insights.",
    benefits: [
      "Industry-wide security trends and forecasts",
      "Data-driven risk assessment models",
      "Customizable threat intelligence dashboards",
    ],
    useCases: [
      "Businesses adapting security strategies",
      "Tech companies optimizing defense systems",
      "Researchers analyzing threat trends",
    ],
  },
};

const FeatureDetails = () => {
  const { featureType } = useParams();
  const feature = featureDetails[featureType];

  if (!feature) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#09090b] text-white font-black uppercase tracking-widest">
        <Activity className="w-12 h-12 text-red-500 mb-6 animate-pulse" />
        <h2 className="text-4xl mb-4">Module Not Loaded</h2>
        <span className="text-red-500/50 mb-8">Error: Null_Reference_Exception</span>
        <Link to="/" className="px-8 py-3 bg-white/05 border border-white/10 hover:border-red-500/50 transition-all rounded-lg flex items-center gap-3 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Abort and Return
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white relative overflow-hidden font-sans selection:bg-red-500/30">
      {/* Tactical Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/05 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/05 blur-[120px] rounded-full" />

        {/* Scanning Line Effect */}
        <motion.div
          className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-red-500/30 to-transparent"
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Top Navigation / Breadcrumb */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/05 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
              <Link to="/" className="hover:text-red-500 transition-colors">OS</Link>
              <span className="text-white/20">//</span>
              <span className="text-red-500/70">MODULES</span>
              <span className="text-white/20">//</span>
              <span className="text-white">{featureType?.replace(/-/g, '_').toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Auth: Validated
              </span>
              <span className="text-[8px] font-mono text-gray-600 tracking-tighter">LAT: 40.7128 N // LNG: 74.0060 W</span>
            </div>
            <Link to="/" className="p-2 border border-white/10 rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-all text-gray-400 hover:text-red-500">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">
              {feature.tagline}
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
              {feature.title.split(' ').map((word, i) => (
                <span key={i} className={i === feature.title.split(' ').length - 1 ? "text-red-500" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl font-medium">
              {feature.description}
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-video bg-[#111112] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Activity className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
              <div className="h-full w-full border border-white/05 rounded-xl flex items-center justify-center bg-black/40">
                <Shield className="w-24 h-24 text-red-500 opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
              {/* Decorative Tech Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/30 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/30 rounded-br-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Detailed Data Blocks */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Benefits Block */}
          <motion.div
            className="bg-white/05 border border-white/05 rounded-2xl p-8 backdrop-blur-sm relative group"
            whileHover={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Technical Advantages</h3>
            </div>
            <ul className="space-y-4">
              {feature.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-4 group/item">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <div>
                    <span className="text-gray-300 font-medium">{benefit}</span>
                    <div className="w-0 h-px bg-red-500/30 group-hover/item:w-full transition-all duration-500 mt-1" />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Use Cases Block */}
          <motion.div
            className="bg-white/05 border border-white/05 rounded-2xl p-8 backdrop-blur-sm relative group"
            whileHover={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Cpu className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Operational Integration</h3>
            </div>
            <ul className="space-y-4">
              {feature.useCases.map((useCase, i) => (
                <li key={i} className="flex items-start gap-4 group/item">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                  <div>
                    <span className="text-gray-300 font-medium">{useCase}</span>
                    <div className="w-0 h-px bg-blue-500/20 group-hover/item:w-full transition-all duration-500 mt-1" />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Global Footer Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/05">
          <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Deployment Ready
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Link
              to="/"
              className="flex-1 md:flex-none px-10 py-5 bg-white/05 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all text-center"
            >
              Exit Module
            </Link>
            <Link
              to="/contact"
              className="flex-1 md:flex-none px-10 py-5 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all text-center shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
            >
              Secure Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetails;
