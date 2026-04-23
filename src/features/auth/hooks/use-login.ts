import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { LoginFormValues } from "../types/auth";
import { routes } from "@/constants/routes";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      return res;
    },
    onSuccess: async (res) => {
      // Handle login failure without throwing (avoids Next.js error overlay)
      if (!res?.ok || res?.error) {
        const message =
          res?.error === "CredentialsSignin"
            ? "Email hoặc mật khẩu không chính xác"
            : res?.error || "Đăng nhập thất bại";

        toast.error(message);
        return;
      }

      sessionStorage.setItem("showLoginSuccessToast", "true");

      // Fetch session to determine role for correct redirection
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      const role = session?.user?.role;

      const destination =
        role === "admin"
          ? routes.employeeManagement
          : routes.attendance.personal;

      router.replace(destination);
    },
  });
}
