import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { queryClient } from "@/lib/query-client";
import api from "@/lib/axios";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/logout");
      } catch (e) {
        console.warn("Backend logout failed", e);
      }
      await signOut({ callbackUrl: "/" });
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}
