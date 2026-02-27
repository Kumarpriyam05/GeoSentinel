import http from "./http";

export const adminApi = {
  overview: async () => {
    const { data } = await http.get("/admin/overview");
    return data;
  },
  activeUsers: async () => {
    const { data } = await http.get("/admin/users/active");
    return data;
  },
};

