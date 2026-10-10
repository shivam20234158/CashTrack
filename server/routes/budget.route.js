import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  setBudget,
  getBudgets,
  deleteBudget,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.post("/", protect, setBudget);
router.get("/", protect, getBudgets);
router.delete("/:id", protect, deleteBudget);

export default router;
