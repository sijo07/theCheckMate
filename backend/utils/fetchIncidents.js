import asyncHandler from "express-async-handler";
import { fetchAndStoreIncidents } from "../controllers/incidentController.js";

// ✅ Fetch Data Every 30 seconds (Wrapped with asyncHandler)
const fetchIncidents = (io) => {
  const fetchData = asyncHandler(async () => {
    try {
      await fetchAndStoreIncidents(io);
    } catch (error) {
      console.error("❌ Error fetching incidents:", error.message);
    }
  });

  // ✅ Fetch data immediately and schedule every 30 seconds
  fetchData();
  setInterval(fetchData, 30 * 1000);
};

export default fetchIncidents;
