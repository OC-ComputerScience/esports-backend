import facilityReservationController from "../controllers/facilityReservation.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new FacilityReservation
router.post("/", [authenticate], facilityReservationController.create);

// Update one FacilityReservation
router.put("/:id", [authenticate], facilityReservationController.update);

// Delete one FacilityReservation
router.delete("/:id", [authenticate], facilityReservationController.delete);

// Get all FacilityReservations for a specific facility station
router.get(
  "/station/:facilityStationId",
  [authenticate],
  facilityReservationController.getAllByFacilityStationId,
);

// Get all for a given date and facility station
router.post(
  "/station/date",
  [authenticate],
  facilityReservationController.getAllForDate,
);

// Get one FacilityReservation
router.get("/:id", [authenticate], facilityReservationController.getById);

export default router;
