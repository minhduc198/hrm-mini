import api from "@/lib/axios";

export const logoutApi = async () => {
  const res = await api.post("/api/logout");
  return res.data;
};

export const logoutBackend = async (token: string) => {
  return await api.post("/logout", {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
