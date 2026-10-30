import express from "express";
import {
  getCompanySettings,
  updateCompanySettings,
} from "../controllers/companyController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getCompanySettings);
router.put("/", protect, authorize("admin", "employee"), updateCompanySettings);

export default router;

