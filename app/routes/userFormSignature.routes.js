import formSignatureController from "../controllers/userFormSignature.controller.js";
import {
  authenticate,
  isAdmin,
  isDirector,
} from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Form Signature
router.post("/", [authenticate], formSignatureController.create);

// Update one Form Signature
//router.put("/:id", [authenticate], formSignatureController.update);

// Delete one Form Signature
router.delete("/:id", [authenticate, isAdmin], formSignatureController.delete);

// Get all Form Signatures
router.get("/", [authenticate], formSignatureController.findAll);

// Get one Form Signature
router.get("/:id", [authenticate], formSignatureController.findOne);

router.post(
  "/:id/director",
  [authenticate, isDirector],
  formSignatureController.directorSign,
);

// Get Form Signatures by userId
router.get(
  "/user/:userId",
  [authenticate],
  formSignatureController.getMostRecentForUser,
);

// Get Form Signatures by formVersionId
router.get(
  "/version/:formVersionId",
  [authenticate],
  formSignatureController.findByFormVersionId,
);

export default router;
