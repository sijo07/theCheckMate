import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import {
  Globe,
  Shield,
  Server,
  Sun,
  Moon,
  Activity,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  useGetAllIncidentsQuery,
  useGetTopTargetedCountriesQuery,
  useGetTopTargetedIndustriesQuery,
} from "../../redux/api/incidentApiSlice";
import Loader from "../../components/loader";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Initialize darkMode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) return savedMode === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Set body class based on dark mode
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const {
    data: incidents = [],
    isLoading: loadingIncidents,
    error: errorIncidents,
  } = useGetAllIncidentsQuery();

  const {
    data: topCountries = [],
    isLoading: loadingCountries,
    error: errorCountries,
  } = useGetTopTargetedCountriesQuery();

  const {
    data: topIndustries = [],
    isLoading: loadingIndustries,
    error: errorIndustries,
  } = useGetTopTargetedIndustriesQuery();

  // Calculate additional statistics
  const highSeverityCount =
    incidents.filter((inc) => inc.severity === "High").length || 0;
  const percentHighSeverity = incidents.length
    ? Math.round((highSeverityCount / incidents.length) * 100)
    : 0;

  const stats = [
    {
      title: "Total Incidents",
      value: incidents.length || 0,
      icon: <Shield className="w-6 h-6" />,
      loading: loadingIncidents,
      error: errorIncidents,
      color: "from-red-500 to-pink-600",
    },
    {
      title: "Targeted Industries",
      value: topIndustries.length || 0,
      icon: <Server className="w-6 h-6" />,
      loading: loadingIndustries,
      error: errorIndustries,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Targeted Countries",
      value: topCountries.length || 0,
      icon: <Globe className="w-6 h-6" />,
      loading: loadingCountries,
      error: errorCountries,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "High Severity",
      value: `${percentHighSeverity}%`,
      icon: <Activity className="w-6 h-6" />,
      loading: loadingIncidents,
      error: errorIncidents,
      color: "from-amber-500 to-orange-600",
    },
  ];

  // Chart configurations with dynamic colors based on theme
  const getChartColors = () => {
    return {
      countries: darkMode ? "#ef4444" : "#dc2626",
      industries: darkMode ? "#3b82f6" : "#2563eb",
      background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
      text: darkMode ? "#fff" : "#333",
      grid: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      pieColors: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4CAF50",
        "#9966FF",
        "#FF9F40",
        "#8BC34A",
        "#E91E63",
        "#03A9F4",
        "#9C27B0",
      ],
    };
  };

  const colors = getChartColors();

  const barDataCountries = {
    labels: topCountries.map((c) => c._id || "Unknown Country"),
    datasets: [
      {
        label: "Top Targeted Countries",
        data: topCountries.map((c) => c.count),
        backgroundColor: colors.countries,
        borderRadius: 6,
      },
    ],
  };

  const barDataIndustries = {
    labels: topIndustries.map((i) => i._id || "Unknown Industry"),
    datasets: [
      {
        label: "Top Targeted Industries",
        data: topIndustries.map((i) => i.count),
        backgroundColor: colors.industries,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.text,
          font: {
            family: "'Inter', sans-serif",
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#374151" : "#fff",
        titleColor: darkMode ? "#fff" : "#111",
        bodyColor: darkMode ? "#d1d5db" : "#333",
        borderColor: darkMode ? "#4B5563" : "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "'Inter', sans-serif",
          weight: "600",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: colors.grid,
        },
        ticks: {
          color: colors.text,
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: colors.grid,
        },
        ticks: {
          color: colors.text,
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  // Malware Types Chart Data
  const malwareCount = incidents.reduce((acc, incident) => {
    const malwareType = incident.type || "General Threat";
    acc[malwareType] = (acc[malwareType] || 0) + 1;
    return acc;
  }, {});

  const malwareData = {
    labels: Object.keys(malwareCount),
    datasets: [
      {
        label: "Malware Types",
        data: Object.values(malwareCount),
        backgroundColor: colors.pieColors,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: colors.text,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#374151" : "#fff",
        titleColor: darkMode ? "#fff" : "#111",
        bodyColor: darkMode ? "#d1d5db" : "#333",
        borderColor: darkMode ? "#4B5563" : "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "'Inter', sans-serif",
          weight: "600",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
        },
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div
      className={`${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen p-4 md:p-6 font-sans transition-colors duration-300`}
    >
      <div className="text-sm text-gray-400 pb-6 w-full max-w-5xl">
        <Link to="/" className="hover:underline uppercase hover:font-semibold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="uppercase font-bold text-red-400">admin</span>
        <span className="mx-2">/</span>
        <span className="uppercase font-bold text-red-400">Dashboard</span>
      </div>
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="flex justify-between items-center mb-8"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Cybersecurity Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Real-time threat intelligence and incident monitoring
            </p>
          </div>
          <motion.button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-100 shadow-md"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </motion.button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  {stat.loading ? (
                    <Loader />
                  ) : stat.error ? (
                    <p className="text-red-500">Error loading {stat.title}</p>
                  ) : (
                    <>
                      <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold tracking-tight mt-1">
                        {stat.value}
                      </p>
                    </>
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}
                >
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
          variants={containerVariants}
        >
          <motion.div
            className={`p-4 md:p-6 rounded-xl shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } h-[400px]`}
            variants={chartVariants}
          >
            <h3 className="text-xl font-semibold mb-4">
              Top Targeted Countries
            </h3>
            <Bar data={barDataCountries} options={barOptions} />
          </motion.div>
          <motion.div
            className={`p-4 md:p-6 rounded-xl shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } h-[400px]`}
            variants={chartVariants}
          >
            <h3 className="text-xl font-semibold mb-4">
              Top Targeted Industries
            </h3>
            <Bar data={barDataIndustries} options={barOptions} />
          </motion.div>
        </motion.div>

        <motion.div
          className={`p-4 md:p-6 rounded-xl shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          } mt-6`}
          variants={chartVariants}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            Malware Types Distribution
          </h3>
          <div className="p-4 rounded-lg h-[450px] flex justify-center items-center">
            <Pie data={malwareData} options={pieOptions} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
