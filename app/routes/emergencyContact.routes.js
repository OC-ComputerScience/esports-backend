import emergencyContact from "../controllers/emergencyContact.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create contact
router.post(
  "/:userId/emergencyContacts/",
  [authenticate],
  emergencyContact.create,
);
// Get all contacts for user
router.get(
  "/:userId/emergencyContacts/",
  [authenticate],
  emergencyContact.findAll,
);

// Get one contact for user
router.get(
  "/:userId/emergencyContacts/:id",
  [authenticate],
  emergencyContact.findOne,
);

// update contact
router.put(
  "/:userId/emergencyContacts/:id",
  [authenticate],
  emergencyContact.update,
);

// delete contact
router.delete(
  "/:userId/emergencyContacts/:id",
  [authenticate],
  emergencyContact.delete,
);

// delete all contacts for user (Is this necessary?)
router.delete(
  "/:userId/emergencyContacts/",
  [authenticate],
  emergencyContact.deleteAll,
);

export default router;
