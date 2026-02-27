import { Router } from "express";
import { body, param } from "express-validator";
import { ingestByTrackingId } from "../controllers/trackingController.js";
import { trackingLimiter } from "../middlewares/rateLimiters.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/:trackingId/location",
  trackingLimiter,
  [
    param("trackingId")
      .trim()
      .matches(/^GST-[0-9A-F]{8}$/)
      .withMessage("Invalid trackingId format"),
    body("lat").isFloat({ min: -90, max: 90 }).withMessage("lat must be between -90 and 90"),
    body("lng").isFloat({ min: -180, max: 180 }).withMessage("lng must be between -180 and 180"),
    body("speed").optional().isFloat({ min: 0, max: 1000 }).withMessage("speed must be valid"),
    body("heading").optional().isFloat({ min: 0, max: 360 }).withMessage("heading must be between 0 and 360"),
    body("accuracy").optional().isFloat({ min: 0, max: 10000 }).withMessage("accuracy must be valid"),
    body("timestamp").optional().isISO8601().withMessage("timestamp must be a valid ISO date"),
  ],
  validateRequest,
  ingestByTrackingId,
);

export default router;

