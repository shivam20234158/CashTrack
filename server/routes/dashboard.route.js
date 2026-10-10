import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getDashboard,
  getCategoryAnalytics,
  getMonthlyAnalytics,
  getReportData,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protect, getDashboard);
router.get("/category-analytics", protect, getCategoryAnalytics);
router.get("/monthly-analytics", protect, getMonthlyAnalytics);
router.get("/report", protect, getReportData);

export default router;
