import React from "react";
import { motion } from "framer-motion";

const companyNames = [
  "CyberShield Inc.",
  "SecuTech Solutions",
  "Digital Armor",
  "NetGuard Security",
  "FortiSafe Systems",
  "ThreatBlocker Labs",
  "CipherShield Networks",
  "HexaSecure Technologies",
  "Quantum Defenders",
  "SafeNet Cybersecurity",
  "CyberSentinel",
  "SkyLock Security",
  "Phantom Firewalls",
  "TitanGuard AI",
  "NovaCrypt Systems",
  "HyperDefend",
];

const TrustedCompanies = () => {
  const duplicatedCompanies = [...companyNames, ...companyNames]; 

  return (
    <section className="py-16 px-6 text-center w-full max-w-6xl mx-auto overflow-hidden">
      <h2 className="text-4xl font-extrabold text-white mb-6">
        Trusted by <span className="text-[#ff335e]">Security Experts</span>{" "}
        Worldwide
      </h2>
      <p className="text-gray-400 text-lg mb-8">
        Leading cybersecurity firms rely on our platform to detect, prevent, and
        counter cyber threats.
      </p>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-100%"] }} 
          transition={{ ease: "linear", duration: 12, repeat: Infinity }} 
        >
          {duplicatedCompanies.map((company, index) => (
            <motion.div
              key={index}
              className="px-6 py-3 bg-gray-900 bg-opacity-70 text-gray-300 rounded-xl shadow-lg border border-gray-700 backdrop-blur-lg"
              whileHover={{ scale: 1.1 }} 
            >
              <span className="uppercase font-semibold tracking-widest">
                {company}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
