import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { queryClient } from "@/lib/query-client";
import api from "@/lib/axios";
import { useAttendanceStore } from "../../attendance/stores/attendance";
import { useUserStore } from "@/hooks/use-user-store";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/logout");
      } catch (e) {
        console.warn("Backend logout failed", e);
      }
      // Reset attendance & user store state
      useAttendanceStore.getState().reset();
      useUserStore.getState().reset();

      await signOut({ callbackUrl: "/" });
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}
