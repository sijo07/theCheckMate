import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
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

// Load environment variables (useful if app.js is imported directly)
dotenv.config();

const app = express();

// Middleware - Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:8098",
        "http://localhost:3000",
        process.env.CLIENT_URL, // Allow Vercel frontend
        process.env.VERCEL_URL // Fallback
    ].filter(Boolean), // Remove undefined/null
    credentials: true,
}));
app.use(rateLimiter);

configureMiddleware(app);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/solutions", solutionRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/services", serviceRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
