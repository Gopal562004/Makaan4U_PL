import express from "express";
import { getMarketTrends } from "../controllers/cityController.js";

const router = express.Router();

router.get("/", getMarketTrends);

export default router;

