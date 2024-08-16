import formVersionController from "../controllers/formVersion.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Get all versions for form id
router.get(
  "/:formId/versions/",
  [authenticate],
  formVersionController.findAllForForm,
);

router.get("/version/:id", [authenticate], formVersionController.findOne);

export default router;
