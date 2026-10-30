import express from "express";
import {
  getAllOffices,
  createOffice,
  updateOffice,
  deleteOffice,
} from "../controllers/officeController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllOffices);

// Admin Routes
router.post("/", protect, authorize("admin", "employee"), createOffice);
router.put("/:id", protect, authorize("admin", "employee"), updateOffice);
router.delete("/:id", protect, authorize("admin"), deleteOffice);

export default router;

