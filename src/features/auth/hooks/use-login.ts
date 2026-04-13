import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginApi } from "../api/login";
import { useAuthStore } from "../stores/auth";
import { ApiError } from "@/types/api";

export function useLogin() {
  const router = useRouter();
  const { setUser, setRole } = useAuthStore();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (user) => {
      toast.success("Đăng nhập thành công!");
      setUser(user);
      setRole(user.role || "employee");
      router.replace("/employee-management");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    }
  });
}
