import bcrypt from "bcryptjs";
import Device from "../models/Device.js";
import { persistDeviceLocation } from "../services/trackingService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const parseLocationPayload = (body) => ({
  lat: Number(body.lat),
  lng: Number(body.lng),
  speed: Number(body.speed || 0),
  heading: Number(body.heading || 0),
  accuracy: Number(body.accuracy || 0),
  capturedAt: body.timestamp ? new Date(body.timestamp) : new Date(),
});

const getScopedDeviceQuery = (req, deviceId) => {
  if (req.user.role === "admin") return { _id: deviceId };
  return { _id: deviceId, user: req.user._id };
};

export const ingestByTrackingId = asyncHandler(async (req, res) => {
  const { trackingId } = req.params;
  const deviceKey = req.headers["x-device-key"];

  if (!deviceKey) {
    throw new AppError("Missing x-device-key header", 401);
  }

  const device = await Device.findOne({ trackingId }).select("+ingestKeyHash");
  if (!device) throw new AppError("Invalid trackingId", 404);

  const isKeyValid = await bcrypt.compare(String(deviceKey), device.ingestKeyHash);
  if (!isKeyValid) throw new AppError("Invalid device key", 401);

  const location = parseLocationPayload(req.body);
  const payload = await persistDeviceLocation({
    device,
    ...location,
    source: "ingest",
  });

  return res.status(202).json({
    message: "Location accepted",
    location: payload,
  });
});

export const updateDeviceLocation = asyncHandler(async (req, res) => {
  const device = await Device.findOne(getScopedDeviceQuery(req, req.params.deviceId));
  if (!device) throw new AppError("Device not found", 404);

  const location = parseLocationPayload(req.body);
  const payload = await persistDeviceLocation({
    device,
    ...location,
    source: "dashboard",
  });

  return res.json({ location: payload });
});

