import matchParticipant from "../controllers/matchParticipant.controller.js";
import { Router } from "express";

const router = Router();

// Create a new MatchParticipant
router.post("/", matchParticipant.create);

// Retrieve a specific MatchParticipant by ID
router.get("/:id", matchParticipant.findOne);

// Update an existing MatchParticipant by ID
router.put("/:id", matchParticipant.update);

// Delete a MatchParticipant by ID
router.delete("/:id", matchParticipant.delete);

router.get("/match/:matchId", matchParticipant.findAllForMatch);

// Get all MatchParticipants for a specific user
router.get("/alias/:aliasId", matchParticipant.findAllForAlias);

export default router;
