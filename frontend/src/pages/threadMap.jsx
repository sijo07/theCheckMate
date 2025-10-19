import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import "../index.css";
import TopTargetCountry from "../components/map/topTargetCountry";
import TopTargetIndustry from "../components/map/topTargetIndustry";
import TopMalwareType from "../components/map/topMalwareType";
import CyberMap from "../components/map/cyberMap";
import IncidentFeed from "../components/map/incidentFeed";
import {
  useGetAllIncidentsQuery,
  useGetAttacksOnThisDayQuery,
} from "../redux/api/incidentApiSlice";

const CyberThreatMap = () => {
  const [incidents, setIncidents] = useState([]);
  const [attacksOnThisDay, setAttacksOnThisDay] = useState(0);

  const {
    data: fetchedIncidents,
    isLoading,
    error,
  } = useGetAllIncidentsQuery();
  const { data: attacksOnThisDayData } = useGetAttacksOnThisDayQuery();

  useEffect(() => {
    if (fetchedIncidents) setIncidents(fetchedIncidents);
  }, [fetchedIncidents]);

  useEffect(() => {
    if (attacksOnThisDayData?.attacksOnThisDay) {
      setAttacksOnThisDay(attacksOnThisDayData.attacksOnThisDay);
    }
  }, [attacksOnThisDayData]);

  useEffect(() => {
    const socket = io("http://localhost:5001");
    socket.on("new-incident", (newIncidents) => {
      setIncidents((prev) => [...newIncidents, ...prev]);
      setAttacksOnThisDay((prev) => prev + newIncidents.length);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans px-4 sm:px-6 lg:px-8 py-4 flex flex-col">
      {/* Breadcrumb Navigation */}
      <motion.div
        className="text-sm text-gray-400 pb-6 w-full max-w-5xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="hover:underline uppercase hover:font-semibold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="uppercase font-bold text-red-400">Live Map</span>
      </motion.div>

      <main className="grid grid-cols-1 lg:grid-cols-9 gap-4 flex-grow">
        {/* Left Sidebar */}
        <motion.aside
          className="lg:col-span-2 flex flex-col space-y-4 overflow-y-auto"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gray-950 p-4 rounded-lg shadow-lg">
            <TopMalwareType />
          </div>
          <div className="bg-gray-950 p-4 rounded-lg shadow-lg">
            <TopTargetIndustry />
          </div>
        </motion.aside>

        {/* Main Map Section */}
        <motion.section
          className="lg:col-span-5 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1
            className="text-3xl font-bold text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            LIVE CYBER THREAT MAP
          </motion.h1>
          <motion.p
            className="text-[#ff335e] text-lg font-semibold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {attacksOnThisDay.toLocaleString()} ATTACKS ON THIS DAY
          </motion.p>
          <motion.div
            className="w-full h-[500px] lg:h-[600px] mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {isLoading ? (
              <p className="text-gray-300 text-center">Loading incidents...</p>
            ) : error ? (
              <p className="text-[#ff335e] text-center">
                Error fetching incidents
              </p>
            ) : (
              <CyberMap incidents={incidents} />
            )}
          </motion.div>

          {/* Legend */}
          <motion.div
            className="flex space-x-4 mt-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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
        </motion.section>

        {/* Right Sidebar */}
        <motion.aside
          className="lg:col-span-2 flex flex-col space-y-4 overflow-y-auto"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gray-950 p-4 rounded-lg shadow-lg">
            <IncidentFeed />
          </div>
          <div className="bg-gray-950 p-4 rounded-lg shadow-lg">
            <TopTargetCountry />
          </div>
        </motion.aside>
      </main>
    </div>
  );
};

export default CyberThreatMap;
