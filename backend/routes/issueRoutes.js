import express from "express";
import {
    getIssues,
    getIssueById,
    createIssue,
    updateIssue,
    assignIssue,
    addComment,
    resolveIssue,
    deleteIssue,
} from "../controllers/issueController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes
router.route("/").get(authenticate, getIssues).post(authenticate, createIssue);
router.route("/:id").get(authenticate, getIssueById).put(authenticate, updateIssue).delete(authenticate, authorizeAdmin, deleteIssue);
router.route("/:id/assign").put(authenticate, authorizeAdmin, assignIssue);
router.route("/:id/comments").post(authenticate, addComment);
router.route("/:id/resolve").put(authenticate, resolveIssue);

export default router;
