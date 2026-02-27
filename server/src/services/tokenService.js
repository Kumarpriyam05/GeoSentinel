import jwt from "jsonwebtoken";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

export const signToken = (user) =>
  jwt.sign({ sub: user.id || user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    throw new AppError("Invalid or expired token", 401);
  }
};

