import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";

const featureDetails = {
  "real-time-tracking": {
    title: "Real-Time Attack Tracking",
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
      "Government agencies tracking cyber incidents",
    ],
  },
  "rapid-threat-resolution": {
    title: "Rapid Threat Resolution",
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
      "Researchers analyzing cyber threat trends",
    ],
  },
};

const FeatureDetails = () => {
  const { featureType } = useParams();
  const feature = featureDetails[featureType];
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  if (!feature) {
    return (
      <motion.div
        className="h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold">Feature Not Found</h2>
        <Link to="/" className="mt-6 text-red-500 hover:underline text-lg">
          🔙 Back to Home
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen px-10 py-16 flex flex-col items-center transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center pb-6">
        <motion.div className="text-lg text-gray-400">
          <Link
            to="/"
            className="hover:text-gray-200 transition hover:underline"
          >
            Home
          </Link>
          <span className="mx-3">/</span>
          <span className="text-red-400 font-bold uppercase">
            {feature.title}
          </span>
        </motion.div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-700 text-white dark:bg-gray-300 dark:text-black"
        >
          {darkMode ? (
            <FaSun className="text-yellow-600" />
          ) : (
            <FaMoon className="text-gray-100" />
          )}
        </button>
      </div>

      {/* Hero Section */}
      <motion.div className="w-full max-w-6xl bg-gradient-to-r from-red-500 to-red-900 text-white text-center shadow-xl rounded-xl p-12">
        <h1 className="text-5xl font-extrabold">{feature.title}</h1>
        <p className="text-lg mt-4">{feature.description}</p>
      </motion.div>

      {/* Feature Content Section */}
      <motion.div className="w-full max-w-6xl bg-gray-900/90 backdrop-blur-lg p-10 mt-10 rounded-xl shadow-2xl border border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Key Benefits */}
          <motion.div>
            <h3 className="text-3xl font-semibold text-red-400">
              Key Benefits
            </h3>
            <ul className="mt-5 space-y-3">
              {feature.benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-800 rounded-lg text-gray-100 shadow-md hover:bg-gray-700 transition text-lg"
                >
                  ✅ {benefit}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Who Can Use This? */}
          <motion.div>
            <h3 className="text-3xl font-semibold text-red-400">
              Who Can Use This?
            </h3>
            <ul className="mt-5 space-y-3">
              {feature.useCases.map((useCase, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-800 text-gray-100 rounded-lg shadow-md hover:bg-gray-700 transition text-lg"
                >
                  🔹 {useCase}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div className="mt-8 flex justify-center space-x-6">
          <Link
            to="/"
            className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all shadow-lg text-lg"
          >
            Back
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-all shadow-lg text-lg"
          >
            Contact
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FeatureDetails;
