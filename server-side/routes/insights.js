import express from "express";
import {
  getAllInsights,
  getInsightBySlug,
  createInsight,
  updateInsight,
  deleteInsight,
} from "../controllers/insightController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllInsights);
router.get("/:slug", getInsightBySlug);

// Admin Routes
router.post("/", protect, authorize("admin", "employee"), createInsight);
router.put("/:id", protect, authorize("admin", "employee"), updateInsight);
router.delete("/:id", protect, authorize("admin"), deleteInsight);

export default router;
