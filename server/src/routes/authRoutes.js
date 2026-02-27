import { Router } from "express";
import { body } from "express-validator";
import { getCurrentUser, login, logout, register } from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimiters.js";
import { protect } from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be between 2 and 80 characters"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8, max: 64 })
      .withMessage("Password must be between 8 and 64 characters"),
  ],
  validateRequest,
  register,
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login,
);

router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);

export default router;

