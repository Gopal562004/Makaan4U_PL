import express from "express";
import { getMarketTrends, updateMarketTrend } from "../controllers/cityController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getMarketTrends);
router.put("/:city", protect, authorize("admin", "employee"), updateMarketTrend);

export default router;
