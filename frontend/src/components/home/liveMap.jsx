import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LiveMap = () => {
  return (
    <motion.section
      className="relative w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="relative h-96 w-full overflow-hidden rounded-xl shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Image */}
        <motion.img
          className="h-full w-full object-cover"
          src="/map.jpg"
          alt="Live Threat Map"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]"></div>
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
          <motion.h1
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Live Threat Map
          </motion.h1>

          {/* Threat Legends */}
          <motion.div
            className="flex space-x-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {[
              { color: "bg-red-500", label: "Malware" },
              { color: "bg-yellow-500", label: "Phishing" },
              { color: "bg-pink-500", label: "Exploit" },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className={`w-4 h-4 ${item.color} rounded-full`}></span>
                <span className="text-gray-300 text-sm">{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* View Map Button */}
          <Link to="/map">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 text-lg rounded-lg">
                View Map
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default LiveMap;
