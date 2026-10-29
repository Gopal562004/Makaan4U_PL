import express from "express";
import {
  getAllDevelopers,
  getDeveloperBySlug,
} from "../controllers/developerController.js";

const router = express.Router();

router.get("/", getAllDevelopers);
router.get("/:slug", getDeveloperBySlug);

export default router;

