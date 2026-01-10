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

// Trust proxy is required for secure cookies behind a proxy (like Render/Vercel)
app.set("trust proxy", 1);

// Middleware - Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
// Allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8098",
    "http://localhost:8005",
    "http://localhost:3000",
    "https://thecheckmate.onrender.com",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("onrender.com")) {
            callback(null, true);
        } else {
            console.log("❌ CORS Blocked:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests explicitly
app.options('*', cors());
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

// Root Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Global Error Handler
app.use(errorHandler);

export default app;
