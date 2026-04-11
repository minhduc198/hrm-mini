import axios from "axios";
import { ApiError } from "@/types/api";

const api = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    if (config.url && !config.url.startsWith("http") && !config.url.startsWith("/api")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      config.url = `${baseUrl}${config.url}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status || 503; // Default to Service Unavailable for network errors
    const message = 
      error.response?.data?.message || 
      error.message || 
      "Đã có lỗi xảy ra, vui lòng thử lại sau.";
    
    return Promise.reject({ message, status } as ApiError);
  }
);

export default api;