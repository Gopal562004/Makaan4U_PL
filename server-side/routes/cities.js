import express from "express";
import { getAllCities, getCityBySlug } from "../controllers/cityController.js";

const router = express.Router();

router.get("/", getAllCities);
router.get("/:slug", getCityBySlug);

export default router;

