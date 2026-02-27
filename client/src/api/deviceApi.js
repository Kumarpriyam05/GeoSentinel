import http from "./http";

export const deviceApi = {
  list: async ({ search = "", status = "all" } = {}) => {
    const { data } = await http.get("/devices", {
      params: { search, status },
    });
    return data;
  },
  create: async (payload) => {
    const { data } = await http.post("/devices", payload);
    return data;
  },
  update: async (deviceId, payload) => {
    const { data } = await http.patch(`/devices/${deviceId}`, payload);
    return data;
  },
  remove: async (deviceId) => {
    await http.delete(`/devices/${deviceId}`);
  },
  history: async (deviceId, limit = 150) => {
    const { data } = await http.get(`/devices/${deviceId}/history`, {
      params: { limit },
    });
    return data;
  },
  pushLocation: async (deviceId, payload) => {
    const { data } = await http.post(`/devices/${deviceId}/location`, payload);
    return data;
  },
};

