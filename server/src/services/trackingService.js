import LocationHistory from "../models/LocationHistory.js";
import { emitDeviceStatus, emitLocationUpdate } from "../sockets/socketServer.js";

const BROADCAST_INTERVAL_MS = 250;
const broadcastQueue = new Map();

const queueLocationBroadcast = (deviceId, userId, payload) => {
  const key = String(deviceId);
  const existing = broadcastQueue.get(key);

  if (existing) {
    existing.payload = payload;
    return;
  }

  const timer = setTimeout(() => {
    const queued = broadcastQueue.get(key);
    if (!queued) return;
    emitLocationUpdate(deviceId, userId, queued.payload);
    broadcastQueue.delete(key);
  }, BROADCAST_INTERVAL_MS);

  broadcastQueue.set(key, { timer, payload });
};

export const persistDeviceLocation = async ({
  device,
  lat,
  lng,
  speed = 0,
  heading = 0,
  accuracy = 0,
  source = "ingest",
  capturedAt = new Date(),
}) => {
  const wasOnline = Boolean(device.isOnline);

  device.lastLocation = {
    lat,
    lng,
    speed,
    heading,
    accuracy,
    timestamp: capturedAt,
  };
  device.lastActiveAt = capturedAt;
  device.isOnline = true;
  await device.save();

  await LocationHistory.create({
    user: device.user,
    device: device._id,
    coordinates: {
      type: "Point",
      coordinates: [lng, lat],
    },
    speed,
    heading,
    accuracy,
    source,
    capturedAt,
  });

  const payload = {
    deviceId: String(device._id),
    userId: String(device.user),
    lat,
    lng,
    speed,
    heading,
    accuracy,
    source,
    capturedAt: capturedAt.toISOString(),
    isOnline: true,
  };

  if (!wasOnline) {
    emitDeviceStatus(String(device._id), String(device.user), {
      deviceId: String(device._id),
      isOnline: true,
      at: new Date().toISOString(),
    });
  }

  queueLocationBroadcast(String(device._id), String(device.user), payload);
  return payload;
};

export const markDeviceOffline = async (device) => {
  if (!device.isOnline) return;
  device.isOnline = false;
  await device.save();

  emitDeviceStatus(String(device._id), String(device.user), {
    deviceId: String(device._id),
    isOnline: false,
    at: new Date().toISOString(),
  });
};

