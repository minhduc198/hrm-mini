import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { LoginFormValues } from "../types/auth";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      return res;
    },
    onSuccess: () => {
      toast.success("Đăng nhập thành công!");
      router.replace("/employee-management");
      router.refresh(); // Refresh to update session
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đăng nhập thất bại");
    }
  });
}
