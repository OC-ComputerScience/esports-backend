import match from "../controllers/match.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Match
router.post("/", [authenticate], match.create);

// Update one match
router.put("/:id", [authenticate], match.update);

// Delete one match
router.delete("/:id", [authenticate, isAdmin], match.delete);

// Get all matches
router.get("/", [authenticate], match.findAll);

// Get one match
router.get("/:id", [authenticate], match.findOne);

export default router;
