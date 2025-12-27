import React from "react";
import { motion } from "framer-motion";

const companyNames = [
  "OmniNexus Cyber",
  "Vortex Sentinel",
  "Aegis Protocols",
  "Spectra Security",
  "Nova Defender",
  "Cobalt Shield",
  "Zenith Defense",
  "Obsidian Network",
  "Axon Security",
  "Icarus Systems",
];

const TrustedCompanies = () => {
  const duplicatedCompanies = [...companyNames, ...companyNames, ...companyNames];

  return (
    <section className="w-full overflow-hidden bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.6em] mb-4">
          Strategic Alliances
        </h2>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 italic">
          Trusted by Global <span className="text-red-500">Security Pioneers</span>
        </h2>
        <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
          Leading cybersecurity firms rely on our platform to detect, prevent, and counter global threat vectors.
        </p>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="relative flex overflow-x-hidden group">
        <motion.div
          className="flex whitespace-nowrap gap-8 py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {duplicatedCompanies.map((company, index) => (
            <div
              key={index}
              className="flex items-center gap-6 px-10 py-6 bg-[#111112] border border-white/05 rounded-xl shadow-2xl transition-all duration-300 hover:border-red-500/30 hover:scale-105"
            >
              {/* Strategic Status Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />

              <span className="text-[14px] font-black text-white uppercase tracking-[0.3em] font-mono">
                {company}
              </span>

              {/* Technical Separator */}
              <div className="h-4 w-px bg-white/10" />

              <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">
                VERIFIED_NODE
              </span>
            </div>
          ))}
        </motion.div>

        {/* Gradient Overlays for smooth edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default TrustedCompanies;
