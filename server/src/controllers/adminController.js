import Device from "../models/Device.js";
import LocationHistory from "../models/LocationHistory.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getOverview = asyncHandler(async (_req, res) => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const [totalUsers, totalDevices, onlineDevices, activeUsers, updatesLast24h] = await Promise.all([
    User.countDocuments(),
    Device.countDocuments(),
    Device.countDocuments({ isOnline: true }),
    User.countDocuments({ lastSeenAt: { $gte: fifteenMinutesAgo } }),
    LocationHistory.countDocuments({ capturedAt: { $gte: oneDayAgo } }),
  ]);

  return res.json({
    metrics: {
      totalUsers,
      totalDevices,
      onlineDevices,
      activeUsers,
      updatesLast24h,
    },
  });
});

export const getActiveUsers = asyncHandler(async (_req, res) => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const users = await User.find({ lastSeenAt: { $gte: cutoff } })
    .select("name email role lastSeenAt createdAt")
    .sort({ lastSeenAt: -1 })
    .limit(100)
    .lean();

  const devicesByUser = await Device.aggregate([
    { $match: { isOnline: true } },
    { $group: { _id: "$user", onlineDevices: { $sum: 1 } } },
  ]);

  const onlineByUserId = new Map(devicesByUser.map((item) => [String(item._id), item.onlineDevices]));

  return res.json({
    users: users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      lastSeenAt: user.lastSeenAt,
      createdAt: user.createdAt,
      onlineDevices: onlineByUserId.get(String(user._id)) || 0,
    })),
  });
});

