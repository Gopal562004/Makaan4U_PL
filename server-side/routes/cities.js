import express from "express";
import {
  getAllCities,
  getCityBySlug,
  createCity,
  updateCity,
  deleteCity,
} from "../controllers/cityController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllCities);
router.get("/:slug", getCityBySlug);

// Admin Routes
router.post("/", protect, authorize("admin", "employee"), createCity);
router.put("/:id", protect, authorize("admin", "employee"), updateCity);
router.delete("/:id", protect, authorize("admin"), deleteCity);

export default router;
