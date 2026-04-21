import api from "@/lib/axios";
import { queryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useAttendanceStore } from "../../attendance/stores/attendance";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/logout");
      } catch (e) {
        console.warn("Backend logout failed", e);
      }
      useAttendanceStore.getState().reset();

      await signOut({ callbackUrl: "/" });
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}
