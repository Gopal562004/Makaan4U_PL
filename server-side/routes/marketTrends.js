import express from "express";
import {
  getMarketTrends,
  updateMarketTrend,
  deleteMarketTrend,
} from "../controllers/cityController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getMarketTrends);
router.put("/:city", protect, authorize("admin", "employee"), updateMarketTrend);
router.delete("/:city", protect, authorize("admin"), deleteMarketTrend);

export default router;
