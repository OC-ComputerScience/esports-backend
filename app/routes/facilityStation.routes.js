import facilityStationController from "../controllers/facilityStation.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Facility Station
router.post("/", [authenticate], facilityStationController.create);

// Update one Facility Station
router.put("/:id", [authenticate], facilityStationController.update);

// Delete one Facility Station
router.delete("/:id", [authenticate], facilityStationController.delete);

// Get all Facility Stations
router.get("/", [authenticate], facilityStationController.getAll);

// Get one Facility Station by ID
router.get("/:id", [authenticate], facilityStationController.getById);

export default router;
