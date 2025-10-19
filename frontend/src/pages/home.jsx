import React, { useRef } from "react";
import { Link } from "react-router-dom";
import TrustedCompanies from "@/components/home/trustedCompanies";
import { Navigation } from "./auth";
import backgroundImage from "../assets/bg.jpg";
import Feature from "@/components/home/feature";
import LiveMap from "@/components/home/liveMap";
import Malware from "@/components/home/malware";
import { motion, useInView } from "framer-motion";

const Home = () => {
  const trustedCompaniesRef = useRef(null);
  const featureRef = useRef(null);
  const liveMapRef = useRef(null);
  const malwareRef = useRef(null);

  // Detect when sections come into view
  const isTrustedCompaniesInView = useInView(trustedCompaniesRef, {
    once: true,
    margin: "-100px",
  });
  const isFeatureInView = useInView(featureRef, {
    once: true,
    margin: "-100px",
  });
  const isLiveMapInView = useInView(liveMapRef, {
    once: true,
    margin: "-100px",
  });
  const isMalwareInView = useInView(malwareRef, {
    once: true,
    margin: "-100px",
  });

  const scrollToTrustedCompanies = () => {
    if (trustedCompaniesRef.current) {
      trustedCompaniesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navigation />
      <motion.div
        className="min-h-screen bg-gray-900 text-white flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Hero Section */}
        <motion.header
          className="w-full h-screen flex flex-col justify-center items-center text-center relative px-6"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]"></div>
          <motion.div
            className="relative"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold">CheckMate</h1>
            <p className="text-lg md:text-2xl text-gray-300 mt-4 max-w-2xl mx-auto capitalize">
              Stay ahead of cyber threats with real-time monitoring, analytics,
              and AI-driven insights.
            </p>
            <motion.div
              className="mt-6 flex gap-4 items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                onClick={scrollToTrustedCompanies}
                className="px-6 py-3 border border-white text-lg rounded-lg hover:bg-white hover:text-gray-900 transition"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </motion.header>

        {/* Scroll-Reveal Sections */}
        <motion.div
          ref={trustedCompaniesRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isTrustedCompaniesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <TrustedCompanies />
        </motion.div>

        <motion.div
          ref={featureRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isFeatureInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Feature />
        </motion.div>

        <motion.div
          ref={liveMapRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isLiveMapInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <LiveMap />
        </motion.div>

        <motion.div
          ref={malwareRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isMalwareInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Malware />
        </motion.div>

        {/* Footer */}
        <footer className="w-full py-6 text-center bg-gray-800 text-gray-400 mt-auto">
          <p>&copy; 2025 Cyber Threat Tracker. All rights reserved.</p>
        </footer>
      </motion.div>
    </>
  );
};

export default Home;
