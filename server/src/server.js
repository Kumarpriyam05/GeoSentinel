import http from "node:http";
import app from "./app.js";
import connectDb from "./config/db.js";
import env from "./config/env.js";
import { initSocketServer } from "./sockets/socketServer.js";

let httpServer;

const start = async () => {
  await connectDb();
  httpServer = http.createServer(app);
  initSocketServer(httpServer);

  httpServer.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`GeoSentinel API running on port ${env.port}`);
  });
};

const gracefulShutdown = (signal) => {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}. Closing server...`);
  if (!httpServer) {
    process.exit(0);
  }
  httpServer.close(() => process.exit(0));
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("uncaughtException", (error) => {
  // eslint-disable-next-line no-console
  console.error("Uncaught exception", error);
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled rejection", error);
});

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start GeoSentinel backend", error);
  process.exit(1);
});

