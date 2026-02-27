import User from "../models/User.js";
import { signToken } from "../services/tokenService.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const serializeUser = (user) => ({
  id: user.id || user._id?.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  lastSeenAt: user.lastSeenAt,
  createdAt: user.createdAt,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new AppError("Email is already registered", 409);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
  });

  const token = signToken(user);
  return res.status(201).json({
    token,
    user: serializeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  user.lastSeenAt = new Date();
  await user.save();

  const token = signToken(user);
  return res.json({
    token,
    user: serializeUser(user),
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.json({ user: serializeUser(req.user) });
});

export const logout = asyncHandler(async (_req, res) => {
  return res.json({ message: "Logged out" });
});

