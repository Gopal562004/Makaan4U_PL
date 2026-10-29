import express from "express";
import {
  getAllLocalities,
  getLocalityBySlug,
} from "../controllers/localityController.js";

const router = express.Router();

router.get("/", getAllLocalities);
router.get("/:slug", getLocalityBySlug);

export default router;

