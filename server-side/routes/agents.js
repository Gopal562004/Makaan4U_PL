import express from "express";
import {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} from "../controllers/agentController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllAgents);
router.get("/:id", getAgentById);

// Admin Routes
router.post("/", protect, authorize("admin", "employee"), createAgent);
router.put("/:id", protect, authorize("admin", "employee"), updateAgent);
router.delete("/:id", protect, authorize("admin"), deleteAgent);

export default router;

