import express from "express";
import {
  getAllIncidents,
  getTopTargetedCountries,
  getTopTargetedIndustries,
  getAttacksOnThisDay,
  resolveIncident,
} from "../controllers/incidentController.js";

const router = express.Router();

// 🔹 Route to get all cyber incidents
router.get("/", getAllIncidents);

// 🔹 Route to get top targeted countries
router.get("/top-targeted-countries", getTopTargetedCountries);

// 🔹 Route to get top targeted industries
router.get("/top-targeted-industries", getTopTargetedIndustries);

// 🔹 Route to get attack count for today
router.get("/attacks-on-this-day", getAttacksOnThisDay);

// 🔹 Route to resolve incident
router.put("/:id/resolve", resolveIncident);

export default router;
