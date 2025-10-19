import axios from "axios";
import asyncHandler from "../middlewares/asyncHandler.js";
import Incident from "../models/incidentModel.js";
import dotenv from "dotenv";

dotenv.config();

const THREAT_API_URL = "https://otx.alienvault.com/api/v1/pulses/subscribed";
const API_KEY = process.env.THREAT_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: THREAT_API_KEY is missing in .env file");
  process.exit(1);
}

// 🟢 Fetch and Store Cyber Incidents
const fetchAndStoreIncidents = asyncHandler(async (io) => {
  console.log("🔎 Fetching cyber incidents...");

  const response = await axios.get(THREAT_API_URL, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!response.data || !response.data.results) {
    console.error("❌ No data received from API");
    return;
  }

  const incidents = response.data.results.map((incident) => {
    const sourceLocation = extractCountry(incident);
    const targetLocation = extractCountry(incident) || generateRandomLocation(); 

    const validTypes = [
      "DDoS",
      "Phishing",
      "Malware",
      "Ransomware",
      "Unauthorized Access",
    ];
    const validSourceTypes = [
      "Government",
      "Hacker Group",
      "Insider Threat",
      "Cybercriminal",
    ];

    const type = validTypes.includes(categorizeIncident(incident.tags || []))
      ? categorizeIncident(incident.tags || [])
      : generateRandomType(); // Random type if invalid or missing

    const sourceType = validSourceTypes.includes(incident.author_name || "")
      ? incident.author_name || "Unknown"
      : generateRandomSourceType(); // Random sourceType if invalid or missing

    // Use relevant industry from tags or generate random industry if missing
    const industry =
      getIndustryFromTags(incident.tags || []) || generateRandomIndustry();

    return {
      title: incident.name || "Unknown Title",
      description: incident.description || "No description available",
      date: new Date(incident.created) || new Date(),
      type: type,
      source: sourceLocation || generateRandomLocation(),
      target: targetLocation,
      industry: industry,
      attackVector: getAttackVectorFromTags(incident.tags || []),
      sourceType: sourceType,
    };
  });

  console.log(`✅ Processing ${incidents.length} incidents...`);

  let incidentIndex = 0;

  // Use setInterval to insert one incident per second
  const intervalId = setInterval(async () => {
    if (incidentIndex < incidents.length) {
      try {
        const incident = incidents[incidentIndex];
        // Insert one incident
        await Incident.create(incident);
        console.log(`✅ Incident inserted: ${incident.title}`);

        io.emit("new-incident", [incident]); // Emit the inserted incident via WebSocket

        incidentIndex++; // Move to the next incident
      } catch (error) {
        console.error("❌ Error inserting incident:", error.message);
      }
    } else {
      clearInterval(intervalId); // Stop the interval once all incidents are inserted
      console.log("✅ All incidents have been inserted.");
    }
  }, 1000); // Insert one incident every 1000ms (1 second)
});

// ✅ Get All Incidents
const getAllIncidents = asyncHandler(async (req, res) => {
  const incidents = await Incident.find().sort({ date: -1 }).limit(100);
  res.json(incidents);
});

// ✅ Get Top Targeted Countries
const getTopTargetedCountries = asyncHandler(async (req, res) => {
  const countryStats = await Incident.aggregate([
    { $group: { _id: "$target.country", count: { $sum: 1 } } },
    { $match: { _id: { $ne: "Unknown" } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  res.json(countryStats);
});

// ✅ Get Top Targeted Industries
const getTopTargetedIndustries = asyncHandler(async (req, res) => {
  const industryStats = await Incident.aggregate([
    { $group: { _id: "$industry", count: { $sum: 1 } } },
    { $match: { _id: { $ne: "General" } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  res.json(industryStats);
});

// ✅ Get Attacks on This Day from the Database
const getAttacksOnThisDay = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day

  // Count the incidents that occurred today
  const attacksOnThisDayCount = await Incident.countDocuments({
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  res.json({ attacksOnThisDay: attacksOnThisDayCount });
});

// 🛠️ Helper Functions
const getIndustryFromTags = (tags) => {
  if (!tags || !Array.isArray(tags)) return null;

  const industries = {
    banking: "Banking",
    finance: "Banking",
    fintech: "Banking",
    healthcare: "Healthcare",
    hospital: "Healthcare",
    pharma: "Healthcare",
    government: "Government",
    retail: "Retail",
    ecommerce: "Retail",
    energy: "Energy",
    manufacturing: "Manufacturing",
    technology: "Technology",
    telecom: "Telecommunications",
  };

  for (const tag of tags) {
    const lowerTag = tag.toLowerCase(); // Normalize tag case
    if (industries[lowerTag]) {
      return industries[lowerTag]; // Return mapped industry
    }
  }

  return null; // Return null if no valid industry found
};

// Helper function to generate random industry
const generateRandomIndustry = () => {
  const industries = [
    "Banking",
    "Healthcare",
    "Government",
    "Retail",
    "Energy",
    "Technology",
    "Telecommunications",
    "Manufacturing",
    "Finance",
    "E-commerce",
    "Pharma",
    "Education",
    "Insurance",
  ];
  const randomIndex = Math.floor(Math.random() * industries.length);
  return industries[randomIndex];
};

// Helper function to generate random type when missing
const generateRandomType = () => {
  const types = [
    "DDoS",
    "Phishing",
    "Malware",
    "Ransomware",
    "Unauthorized Access",
  ];
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex];
};

// Helper function to generate random source type
const generateRandomSourceType = () => {
  const sourceTypes = [
    "Government",
    "Hacker Group",
    "Insider Threat",
    "Cybercriminal",
  ];
  const randomIndex = Math.floor(Math.random() * sourceTypes.length);
  return sourceTypes[randomIndex];
};

const getAttackVectorFromTags = (tags) => {
  const vectors = ["Phishing", "Exploit", "Ransomware", "Botnet", "DDoS"];
  return tags.find((tag) => vectors.includes(tag)) || "Unknown";
};

const categorizeIncident = (tags) => {
  if (!tags) return "Unknown";
  if (tags.includes("malware")) return "Malware";
  if (tags.includes("phishing")) return "Phishing";
  if (tags.includes("ransomware")) return "Ransomware";
  if (tags.includes("ddos")) return "DDoS Attack";
  if (tags.includes("botnet")) return "Botnet Activity";
  if (tags.includes("exploits")) return "Exploits";
  return "General Threat";
};

// ✅ Extract Source Country from API Response
const extractCountry = (incident) => {
  if (!incident || !incident.indicator || !incident.indicator.geo) return null;
  return {
    country: incident.indicator.geo.country_name || "Unknown",
    lat: incident.indicator.geo.latitude || 0,
    lng: incident.indicator.geo.longitude || 0,
  };
};

// ✅ Generate Random Location for Missing Data
// Helper function to generate random location within a valid country
const generateRandomLocation = () => {
  // List of countries with approximate latitude and longitude bounds
  const countries = [
    {
      country: "United States",
      latRange: [24.396308, 49.384358],
      lngRange: [-125.0, -66.93457],
    },
    {
      country: "Canada",
      latRange: [41.676555, 83.113592],
      lngRange: [-141.0, -52.0],
    },
    {
      country: "Germany",
      latRange: [47.2701, 55.0581],
      lngRange: [5.8663, 15.0431],
    },
    {
      country: "France",
      latRange: [41.3033, 51.1242],
      lngRange: [-5.1436, 9.5621],
    },
    {
      country: "India",
      latRange: [8.0712, 37.0841],
      lngRange: [68.1234, 97.4026],
    },
    {
      country: "Brazil",
      latRange: [-33.7461, 5.2714],
      lngRange: [-73.9851, -34.7927],
    },
    {
      country: "Australia",
      latRange: [-43.748, -10.668],
      lngRange: [113.338, 153.569],
    },
    {
      country: "China",
      latRange: [18.1534, 53.561],
      lngRange: [73.4994, 135.105],
    },
    {
      country: "Russia",
      latRange: [41.185, 81.858],
      lngRange: [19.636, 169.045],
    },
    {
      country: "United Kingdom",
      latRange: [49.6749, 60.8487],
      lngRange: [-8.6493, 1.7799],
    },
    // Add more countries with appropriate lat/lng ranges as needed
  ];

  // Select a random country from the list
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];

  // Generate random latitude and longitude within the selected country's bounds
  const lat = (
    Math.random() * (randomCountry.latRange[1] - randomCountry.latRange[0]) +
    randomCountry.latRange[0]
  ).toFixed(3);
  const lng = (
    Math.random() * (randomCountry.lngRange[1] - randomCountry.lngRange[0]) +
    randomCountry.lngRange[0]
  ).toFixed(3);

  return {
    country: randomCountry.country,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };
};

// Export the functions
export {
  fetchAndStoreIncidents,
  getAllIncidents,
  getTopTargetedCountries,
  getTopTargetedIndustries,
  getAttacksOnThisDay,
};
