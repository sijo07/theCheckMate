import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import initializeSocket from "./config/socket.js";
import fetchIncidents from "./utils/fetchIncidents.js";
import app from "./app.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected. Starting server...");

    // ✅ Create HTTP Server
    const server = http.createServer(app);

    // ✅ Initialize WebSocket Server
    const io = initializeSocket(server);

    // Make io instance available to routes (via app.set, accessible in controllers)
    app.set("io", io);

    // ✅ Start Fetching Incidents
    fetchIncidents(io);

    // 🚀 Start the Server
    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  });

// ✅ Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("⚠️ Shutting down server...");
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");
  } catch (error) {
    console.error("❌ Error during shutdown:", error.message);
  }
  process.exit(0);
});
