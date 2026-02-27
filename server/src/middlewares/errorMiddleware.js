import env from "../config/env.js";
import AppError from "../utils/AppError.js";

export const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    message,
    ...(env.nodeEnv !== "production" && { stack: err.stack }),
  });
};

