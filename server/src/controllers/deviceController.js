import bcrypt from "bcryptjs";
import Device from "../models/Device.js";
import LocationHistory from "../models/LocationHistory.js";
import { buildDeviceCredentials } from "../services/deviceService.js";
import { markDeviceOffline } from "../services/trackingService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const serializeDevice = (device) => ({
  id: device.id || device._id?.toString(),
  name: device.name,
  trackingId: device.trackingId,
  isOnline: device.isOnline,
  user: device.user?.toString?.() || device.user,
  lastActiveAt: device.lastActiveAt,
  lastLocation: device.lastLocation || null,
  createdAt: device.createdAt,
  updatedAt: device.updatedAt,
});

const buildScope = (req, idField = "_id") => {
  if (req.user.role === "admin") {
    return {};
  }
  return { [idField]: req.user._id };
};

export const getDevices = asyncHandler(async (req, res) => {
  const { search = "", status = "all" } = req.query;
  const query = {
    ...buildScope(req, "user"),
  };

  if (status === "online") query.isOnline = true;
  if (status === "offline") query.isOnline = false;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { trackingId: { $regex: search, $options: "i" } },
    ];
  }

  const devices = await Device.find(query).sort({ updatedAt: -1 });
  return res.json({ devices: devices.map(serializeDevice) });
});

export const createDevice = asyncHandler(async (req, res) => {
  const { name } = req.body;
  let ingestKey;
  let device;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const credentials = buildDeviceCredentials();
    ingestKey = credentials.ingestKey;
    const ingestKeyHash = await bcrypt.hash(credentials.ingestKey, 12);

    try {
      device = await Device.create({
        name,
        user: req.user._id,
        trackingId: credentials.trackingId,
        ingestKeyHash,
      });
      break;
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }

  if (!device) {
    throw new AppError("Could not allocate a unique tracking ID. Please retry.", 500);
  }

  return res.status(201).json({
    device: serializeDevice(device),
    ingestKey,
  });
});

export const updateDevice = asyncHandler(async (req, res) => {
  const query = {
    _id: req.params.deviceId,
    ...buildScope(req, "user"),
  };

  const device = await Device.findOne(query);
  if (!device) throw new AppError("Device not found", 404);

  const { name, isOnline } = req.body;
  if (name) device.name = name;

  if (typeof isOnline === "boolean") {
    if (!isOnline) {
      await markDeviceOffline(device);
    } else {
      device.isOnline = true;
      device.lastActiveAt = new Date();
      await device.save();
    }
  } else {
    await device.save();
  }

  return res.json({ device: serializeDevice(device) });
});

export const deleteDevice = asyncHandler(async (req, res) => {
  const query = {
    _id: req.params.deviceId,
    ...buildScope(req, "user"),
  };

  const device = await Device.findOne(query);
  if (!device) throw new AppError("Device not found", 404);

  await Promise.all([LocationHistory.deleteMany({ device: device._id }), Device.deleteOne({ _id: device._id })]);
  return res.status(204).send();
});

export const getDeviceHistory = asyncHandler(async (req, res) => {
  const query = {
    _id: req.params.deviceId,
    ...buildScope(req, "user"),
  };
  const device = await Device.findOne(query);
  if (!device) throw new AppError("Device not found", 404);

  const limit = Math.min(Number(req.query.limit || 150), 500);
  const history = await LocationHistory.find({ device: device._id })
    .sort({ capturedAt: -1 })
    .limit(limit)
    .lean();

  return res.json({
    history: history.map((item) => ({
      id: item._id.toString(),
      lat: item.coordinates.coordinates[1],
      lng: item.coordinates.coordinates[0],
      speed: item.speed,
      heading: item.heading,
      accuracy: item.accuracy,
      source: item.source,
      capturedAt: item.capturedAt,
    })),
  });
});
