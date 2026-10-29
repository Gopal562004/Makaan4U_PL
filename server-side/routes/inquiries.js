import express from "express";
import {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiryStats,
} from "../controllers/inquiryController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public route: website visitors dispatching visits, callbacks & contact forms
router.post("/", createInquiry);

// Protected routes for Admins & Regional Staff
router.get("/stats", protect, authorize("employee", "admin"), getInquiryStats);
router.get("/", protect, authorize("employee", "admin"), getAllInquiries);
router.get("/:id", protect, authorize("employee", "admin"), getInquiryById);
router.put("/:id", protect, authorize("employee", "admin"), updateInquiry);
router.delete("/:id", protect, authorize("admin"), deleteInquiry);

export default router;

