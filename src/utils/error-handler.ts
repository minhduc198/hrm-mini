import { toast } from "sonner";
import { ApiError } from "@/types/api";
import { AxiosError } from "axios";

export const handleError = (error: unknown, fallbackMessage?: string) => {
  let message = fallbackMessage || "Đã có lỗi xảy ra, vui lòng thử lại sau.";

  if (isApiError(error)) {
    message = error.message;
  } else if (isAxiosError(error)) {
    message = error.response?.data?.message || error.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  toast.error(message);
  console.error("[ErrorHandler]", error);
};

function isApiError(error: any): error is ApiError {
  return (
    error &&
    typeof error === "object" &&
    typeof error.message === "string" &&
    typeof error.status === "number"
  );
}

function isAxiosError(error: any): error is AxiosError<{ message?: string }> {
  return error && error.isAxiosError === true;
}
