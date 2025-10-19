import React from "react";
import { Link } from "react-router-dom";

const Feature = () => {
  return (
    <section className="py-12 px-6 text-center w-full max-w-6xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-12 text-white">
        Why Choose
        <span className="text-[#ff335e]">&nbsp;Our Cyber Threat Tracker?</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Real-Time Attack Tracking",
            description:
              "Monitor cyber threats across the globe with live tracking.",
            icon: "🌍",
            gradient: "from-red-500 to-pink-00",
            path: "/feature/real-time-tracking",
          },
          {
            title: "Rapid Cyber Threat Resolution",
            description:
              "Quickly identify and neutralize threats with real-time responses.",
            icon: "⚡",
            gradient: "from-yellow-600 to-orange-800",
            path: "/feature/rapid-threat-resolution",
          },
          {
            title: "Global Threat Insights",
            description:
              "Get reports on the latest cyber threats affecting businesses.",
            icon: "📊",
            gradient: "from-blue-500 to-cyan-800",
            path: "/feature/global-threat-insights",
          },
        ].map((item, index) => (
          <Link key={index} to={item.path}>
            <div
              className={`p-6 bg-gradient-to-r ${item.gradient} rounded-2xl shadow-xl text-white transform hover:scale-105 transition duration-300 cursor-pointer`}
            >
              <div className="text-5xl">{item.icon}</div>
              <h3 className="text-xl font-bold mt-4">{item.title}</h3>
              <p className="text-gray-200 mt-2">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Feature;
