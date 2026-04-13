import axios from "axios";
import { ApiError } from "@/types/api";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach access token from NextAuth session to every request
api.interceptors.request.use(
  async (config) => {
    // Only run on client-side where we can access NextAuth session
    if (typeof window !== "undefined") {
      try {
        const { getSession } = await import("next-auth/react");
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch {
        // getSession failed or not in NextAuth context, proceed without token
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status || 503; // Default to Service Unavailable for network errors
    const message =
      error.response?.data?.message ||
      error.message ||
      "Đã có lỗi xảy ra, vui lòng thử lại sau.";

    // Handle 401 Unauthorized - session expired or invalid token
    if (status === 401 && typeof window !== "undefined") {
      // Only handle on client-side to avoid SSR issues
      import("next-auth/react").then(({ signOut }) => {
        signOut({ callbackUrl: "/", redirect: true });
      });
    }

    return Promise.reject({ message, status } as ApiError);
  },
);

export default api;
