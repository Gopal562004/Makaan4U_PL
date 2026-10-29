import express from "express";
import {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:slug", getProjectBySlug);

// Admin Routes
router.post("/", protect, authorize("admin", "employee"), createProject);
router.put("/:id", protect, authorize("admin", "employee"), updateProject);
router.delete("/:id", protect, authorize("admin"), deleteProject);

export default router;
