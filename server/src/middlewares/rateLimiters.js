import rateLimit from "express-rate-limit";
import env from "../config/env.js";

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });

export const apiLimiter = createLimiter(
  env.rateLimitWindowMs,
  env.rateLimitMax,
  "Too many requests from this IP, please try again later.",
);

export const authLimiter = createLimiter(
  15 * 60 * 1000,
  30,
  "Too many authentication attempts, please try again in a few minutes.",
);

export const trackingLimiter = createLimiter(
  60 * 1000,
  240,
  "Tracking update rate exceeded for this endpoint.",
);

