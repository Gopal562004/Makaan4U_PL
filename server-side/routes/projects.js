import express from "express";
import {
  getAllProjects,
  getProjectBySlug,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:slug", getProjectBySlug);

export default router;

