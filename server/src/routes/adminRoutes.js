import { Router } from "express";
import { getActiveUsers, getOverview } from "../controllers/adminController.js";
import { protect, requireRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);
router.use(requireRole("admin"));

router.get("/overview", getOverview);
router.get("/users/active", getActiveUsers);

export default router;

