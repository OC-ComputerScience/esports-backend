import formVersionController from "../controllers/formVersion.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

router.post("/:formId/versions/", [authenticate], formVersionController.create);

// Get all versions for form id
router.get(
  "/:formId/versions/",
  [authenticate],
  formVersionController.findAllForForm,
);

router.put("/version/:id/", [authenticate], formVersionController.update);

router.get("/version/:id", [authenticate], formVersionController.findOne);

router.post("/version/:versionId/upload", formVersionController.uploadFile);

export default router;
