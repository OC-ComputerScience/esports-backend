import matchData from "../controllers/matchData.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Match Data
router.post("/", [authenticate], matchData.create);

// Update one Match Data
router.put("/:id", [authenticate], matchData.update);

// Delete one Match Data
router.delete("/:id", [authenticate], matchData.delete);

// Get all Metrics for a given title
router.get("/match/:matchId", [authenticate], matchData.getAllForMatch);

// Get one Match Data
router.get("/:id", [authenticate], matchData.getById);

export default router;
