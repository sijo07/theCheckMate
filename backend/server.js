import http from "http";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import configureMiddleware from "./config/middleware.js";
import errorHandler from "./middlewares/errorHandler.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import initializeSocket from "./config/socket.js";
import fetchIncidents from "./utils/fetchIncidents.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected. Starting server...");

    // ✅ Initialize Express App
    const app = express();
    const server = http.createServer(app);

    // ✅ Initialize WebSocket Server
    const io = initializeSocket(server);

    // ✅ Middleware - Increase payload size limit for profile pictures
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(cookieParser());
    app.use(cors({
      origin: ["http://localhost:5173", "http://localhost:8098", "http://localhost:3000"],
      credentials: true
    }));
    app.use(rateLimiter);


    configureMiddleware(app);

    // Make io instance available to routes
    app.set("io", io);

    // ✅ Routes
    app.use("/api/users", userRoutes);
    app.use("/api/incidents", incidentRoutes);
    app.use("/api/notifications", notificationRoutes);
    app.use("/api/reports", reportRoutes);
    app.use("/api/solutions", solutionRoutes);
    app.use("/api/issues", issueRoutes);
    app.use("/api/services", serviceRoutes);

    // ✅ Start Fetching Incidents
    fetchIncidents(io);

    // ✅ Global Error Handler
    app.use(errorHandler);

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
