import express from "express";
import {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServiceRequests,
    getServiceRequestById,
    createServiceRequest,
    updateServiceRequest,
    addNoteToRequest,
    completeServiceRequest,
} from "../controllers/serviceController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Service routes
router.route("/").get(getServices).post(authenticate, authorizeAdmin, createService);
router.route("/:id").get(getServiceById).put(authenticate, authorizeAdmin, updateService).delete(authenticate, authorizeAdmin, deleteService);

// Service request routes
router.route("/requests").get(authenticate, getServiceRequests).post(authenticate, createServiceRequest);
router.route("/requests/:id").get(authenticate, getServiceRequestById).put(authenticate, authorizeAdmin, updateServiceRequest);
router.route("/requests/:id/notes").post(authenticate, addNoteToRequest);
router.route("/requests/:id/complete").put(authenticate, authorizeAdmin, completeServiceRequest);

export default router;
