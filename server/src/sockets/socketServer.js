import { Server } from "socket.io";
import User from "../models/User.js";
import Device from "../models/Device.js";
import env from "../config/env.js";
import { verifyToken } from "../services/tokenService.js";

let io;
const connectedCounts = new Map();

const incrementUserCount = (userId) => {
  const value = connectedCounts.get(userId) || 0;
  connectedCounts.set(userId, value + 1);
};

const decrementUserCount = (userId) => {
  const value = connectedCounts.get(userId) || 0;
  if (value <= 1) {
    connectedCounts.delete(userId);
    return;
  }
  connectedCounts.set(userId, value - 1);
};

const getTotalConnections = () => {
  let total = 0;
  for (const value of connectedCounts.values()) total += value;
  return total;
};

const extractSocketToken = (socket) => {
  const authToken = socket.handshake.auth?.token;
  if (authToken) return String(authToken).replace("Bearer ", "").trim();

  const header = socket.handshake.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return header.split(" ")[1].trim();
  }
  return null;
};

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin.split(",").map((item) => item.trim()),
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = extractSocketToken(socket);
    if (!token) return next(new Error("Authentication token missing"));

    try {
      const payload = verifyToken(token);
      socket.user = {
        id: payload.sub,
        role: payload.role,
      };
      return next();
    } catch (error) {
      return next(error);
    }
  });

  io.on("connection", async (socket) => {
    const userId = String(socket.user.id);
    socket.join(`user:${userId}`);
    if (socket.user.role === "admin") {
      socket.join("admins");
    }

    incrementUserCount(userId);
    io.emit("system:connections", { count: getTotalConnections() });
    await User.findByIdAndUpdate(userId, { lastSeenAt: new Date() }).catch(() => null);

    socket.emit("socket:ready", {
      connectedAt: new Date().toISOString(),
      userId,
    });

    socket.on("tracking:subscribe", async ({ deviceIds = [] }) => {
      if (!Array.isArray(deviceIds) || deviceIds.length === 0) return;

      let allowedIds = deviceIds.map(String);
      if (socket.user.role !== "admin") {
        const devices = await Device.find({
          _id: { $in: allowedIds },
          user: userId,
        }).select("_id");
        allowedIds = devices.map((device) => String(device._id));
      }

      allowedIds.forEach((id) => socket.join(`device:${id}`));
      socket.emit("tracking:subscribed", { deviceIds: allowedIds });
    });

    socket.on("tracking:unsubscribe", ({ deviceIds = [] }) => {
      if (!Array.isArray(deviceIds)) return;
      deviceIds.map(String).forEach((id) => socket.leave(`device:${id}`));
      socket.emit("tracking:unsubscribed", { deviceIds });
    });

    socket.on("disconnect", async () => {
      decrementUserCount(userId);
      io.emit("system:connections", { count: getTotalConnections() });
      await User.findByIdAndUpdate(userId, { lastSeenAt: new Date() }).catch(() => null);
    });
  });

  return io;
};

export const emitLocationUpdate = (deviceId, userId, payload) => {
  if (!io) return;
  io.to(`device:${deviceId}`).emit("location:updated", payload);
  io.to(`user:${userId}`).emit("activity:location", payload);
  io.to("admins").emit("admin:location", payload);
};

export const emitDeviceStatus = (deviceId, userId, payload) => {
  if (!io) return;
  io.to(`device:${deviceId}`).emit("device:status", payload);
  io.to(`user:${userId}`).emit("device:status", payload);
  io.to("admins").emit("admin:device-status", { ...payload, deviceId });
};

export const getSocketServer = () => io;

