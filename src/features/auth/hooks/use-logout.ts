import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth";
import { logoutApi } from "../api/logout";
import { queryClient } from "@/lib/query-client";

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logoutApi,
    onMutate: () => {
      logout();
    },
    onSettled: () => {
      queryClient.clear();
      router.replace("/");
    },
  });
}
