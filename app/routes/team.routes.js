import teams from "../controllers/team.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Team
router.post("/", [authenticate], teams.create);

router.put("/:id", [authenticate], teams.update);

router.delete("/:id", [authenticate], teams.delete);

// Get all teams
router.get("/", [authenticate], teams.findAll);

// Get one team
router.get("/:id", [authenticate], teams.findOne);

export default router;
