import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  createDevice,
  deleteDevice,
  getDeviceHistory,
  getDevices,
  updateDevice,
} from "../controllers/deviceController.js";
import { updateDeviceLocation } from "../controllers/trackingController.js";
import { protect } from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();

router.use(protect);

router.get(
  "/",
  [
    query("status")
      .optional()
      .isIn(["all", "online", "offline"])
      .withMessage("status must be one of: all, online, offline"),
    query("search").optional().isString(),
  ],
  validateRequest,
  getDevices,
);

router.post(
  "/",
  [body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Device name must be between 2 and 80 characters")],
  validateRequest,
  createDevice,
);

router.patch(
  "/:deviceId",
  [
    param("deviceId").isMongoId().withMessage("Invalid device id"),
    body("name").optional().trim().isLength({ min: 2, max: 80 }).withMessage("Invalid device name"),
    body("isOnline").optional().isBoolean().withMessage("isOnline must be boolean"),
  ],
  validateRequest,
  updateDevice,
);

router.delete("/:deviceId", [param("deviceId").isMongoId().withMessage("Invalid device id")], validateRequest, deleteDevice);

router.get(
  "/:deviceId/history",
  [
    param("deviceId").isMongoId().withMessage("Invalid device id"),
    query("limit").optional().isInt({ min: 1, max: 500 }).withMessage("limit must be between 1 and 500"),
  ],
  validateRequest,
  getDeviceHistory,
);

router.post(
  "/:deviceId/location",
  [
    param("deviceId").isMongoId().withMessage("Invalid device id"),
    body("lat").isFloat({ min: -90, max: 90 }).withMessage("lat must be between -90 and 90"),
    body("lng").isFloat({ min: -180, max: 180 }).withMessage("lng must be between -180 and 180"),
    body("speed").optional().isFloat({ min: 0, max: 1000 }).withMessage("speed must be valid"),
    body("heading").optional().isFloat({ min: 0, max: 360 }).withMessage("heading must be between 0 and 360"),
    body("accuracy").optional().isFloat({ min: 0, max: 10000 }).withMessage("accuracy must be valid"),
    body("timestamp").optional().isISO8601().withMessage("timestamp must be a valid ISO date"),
  ],
  validateRequest,
  updateDeviceLocation,
);

export default router;

