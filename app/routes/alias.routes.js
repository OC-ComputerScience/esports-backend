import alias from "../controllers/alias.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

//Create alias
router.post("/:userId/alias", [authenticate], alias.create);

//Find all aliases for a user
router.get("/:userId/alias", [authenticate], alias.findAllForUser);

//Find one alias for a user
router.get("/:userId/alias/:id", [authenticate], alias.findOne);

//Update alias
router.put("/:userId/alias/:id", [authenticate], alias.update);

//Delete one alias
router.delete("/:userId/alias/:id", [authenticate], alias.deleteOne);

//Delete all aliases for one user
router.delete("/:userId/alias", [authenticate], alias.deleteAll);

//Find all aliases for a team
router.get("/team/:teamId", [authenticate], alias.findAllForTeam);

export default router;
