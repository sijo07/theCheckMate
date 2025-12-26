import express from "express";
import {
    getSolutions,
    getSolutionById,
    createSolution,
    updateSolution,
    deleteSolution,
    applySolution,
    rateSolution,
} from "../controllers/solutionController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public/Protected routes
router.route("/").get(authenticate, getSolutions).post(authenticate, createSolution);
router.route("/:id").get(authenticate, getSolutionById).put(authenticate, updateSolution).delete(authenticate, authorizeAdmin, deleteSolution);
router.route("/:id/apply").post(authenticate, applySolution);
router.route("/:id/rate").post(authenticate, rateSolution);

export default router;
