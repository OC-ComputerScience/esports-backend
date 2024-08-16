import recurrenceRule from "../controllers/reservationRecurrenceRule.controller.js"; // Adjust the path as necessary
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new RecurrenceRule
router.post("/", [authenticate, isAdmin], recurrenceRule.create);

// Retrieve all RecurrenceRules
router.get("/", [authenticate, isAdmin], recurrenceRule.findAll);

// Retrieve a single RecurrenceRule with id
router.get("/:id", [authenticate], recurrenceRule.findOne);

// Retrieve by facility reservation id
router.get(
  "/reservation/:reservationId",
  [authenticate],
  recurrenceRule.findByReservationId,
);

// Update a RecurrenceRule with id
router.put("/:id", [authenticate, isAdmin], recurrenceRule.update);

// Delete a RecurrenceRule with id
router.delete("/:id", [authenticate, isAdmin], recurrenceRule.delete);

export default router;
