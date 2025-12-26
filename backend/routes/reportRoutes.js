import express from "express";
import {
    getReports,
    getReportById,
    createReport,
    deleteReport,
    getReportData,
} from "../controllers/reportController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes
router.route("/").get(authenticate, getReports).post(authenticate, createReport);
router.route("/:id").get(authenticate, getReportById).delete(authenticate, deleteReport);
router.route("/:id/data").get(authenticate, getReportData);

export default router;
