import titles from "../controllers/title.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Tutorial
router.post("/", [authenticate], titles.create);

router.put("/:id", [authenticate], titles.update);

router.delete("/:id", [authenticate], titles.delete);

router.get("/:id", [authenticate], titles.find);

router.get("/", [authenticate], titles.findAll);

export default router;
