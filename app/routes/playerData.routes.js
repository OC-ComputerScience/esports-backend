import playerData from "../controllers/playerData.controller.js";
import { Router } from "express";

const router = Router();

// Create a new PlayerData entry
router.post("/", playerData.create);

// Retrieve a specific PlayerData entry by ID
router.get("/:id", playerData.findOne);

// Update an existing PlayerData entry by ID
router.put("/:id", playerData.update);

// Delete a PlayerData entry by ID
router.delete("/:id", playerData.delete);

// Get all PlayerData entries for a specific participant
router.get("/participant/:participantId", playerData.findAllForParticipant);

export default router;
