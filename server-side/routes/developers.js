import express from "express";
import {
  getAllDevelopers,
  getDeveloperBySlug,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
} from "../controllers/developerController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllDevelopers);
router.get("/:slug", getDeveloperBySlug);

// Admin Routes
router.post("/", protect, authorize("admin", "employee"), createDeveloper);
router.put("/:slug", protect, authorize("admin", "employee"), updateDeveloper);
router.delete("/:slug", protect, authorize("admin"), deleteDeveloper);

export default router;
