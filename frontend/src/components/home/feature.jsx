import React from "react";
import { Link } from "react-router-dom";

const Feature = () => {
  return (
    <section className="py-12 px-6 text-center w-full max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em] mb-4">
          Core Competitive Advantages
        </h2>
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
          Why Choose <span className="text-red-500">CheckMate</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Real-Time Tracking",
            description:
              "Global surveillance stream monitoring active threat vectors across all network nodes.",
            icon: "🌍",
            serial: "SYS-TRK-09",
            path: "/feature/real-time-tracking",
          },
          {
            title: "Rapid Neutralization",
            description:
              "Autonomous response protocols designed to isolate and resolve breaches within milliseconds.",
            icon: "⚡",
            serial: "PRO-NET-42",
            path: "/feature/rapid-threat-resolution",
          },
          {
            title: "Intelligence Hub",
            description:
              "Advanced analytics for emerging cryptographic vulnerabilities and predictive defense modeling.",
            icon: "📊",
            serial: "INT-HUB-77",
            path: "/feature/global-threat-insights",
          },
        ].map((item, index) => (
          <Link key={index} to={item.path} className="group">
            <div className="relative p-8 h-full rounded-2xl bg-[#0d0d0e] border border-white/05 overflow-hidden transition-all duration-500 hover:border-red-500/30 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              {/* Background Technical Pattern */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
                <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              </div>

              {/* Top Meta Hub */}
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em] group-hover:text-red-500/50 transition-colors">Module Serial</span>
                  <span className="text-[10px] font-mono font-bold text-gray-500">{item.serial}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-500/20 group-hover:bg-red-500 group-hover:shadow-[0_0_10px_#ef4444] transition-all duration-500" />
              </div>

              {/* Centered Icon with Technical Border */}
              <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <div className="absolute inset-0 border border-white/10 rounded-full group-hover:scale-110 group-hover:border-red-500/20 transition-all duration-700" />
                <div className="absolute inset-2 border border-white/05 rounded-full rotate-45 group-hover:rotate-180 transition-all duration-1000" />
                <div className="text-4xl relative z-10 group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
              </div>

              {/* Content Header */}
              <div className="relative z-10 mb-6 text-center">
                <h3 className="text-[15px] font-black text-white uppercase tracking-[0.3em] mb-4 group-hover:text-red-500 transition-colors">
                  {item.title}
                </h3>
                <div className="w-8 h-0.5 bg-red-500/30 group-hover:w-full group-hover:bg-red-500 transition-all duration-700 mx-auto rounded-full" />
              </div>

              {/* Main Text Content */}
              <p className="text-gray-500 text-[11px] leading-[1.8] font-bold uppercase tracking-[0.15em] relative z-10 transition-colors group-hover:text-gray-300">
                {item.description}
              </p>

              {/* Subtle Scanning Light Bar */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent -translate-y-full group-hover:translate-y-[400px] transition-all duration-[2000ms] pointer-events-none" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Feature;
