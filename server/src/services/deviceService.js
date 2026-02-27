import crypto from "node:crypto";

export const buildDeviceCredentials = () => {
  const trackingId = `GST-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const ingestKey = crypto.randomBytes(24).toString("base64url");
  return { trackingId, ingestKey };
};

