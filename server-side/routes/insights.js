import express from "express";
import {
  getAllInsights,
  getInsightBySlug,
} from "../controllers/insightController.js";

const router = express.Router();

router.get("/", getAllInsights);
router.get("/:slug", getInsightBySlug);

export default router;

