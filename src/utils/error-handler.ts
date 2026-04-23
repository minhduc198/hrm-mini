import { toast } from "sonner";
import { ApiError } from "@/types/api";
import axios, { AxiosError } from "axios";

export class AppError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number = 500,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.message = message;
    this.status = status;
    this.errors = errors;
    this.name = "AppError";

    // Set prototype explicitly for instanceof checks to work across different environments
    Object.setPrototypeOf(this, AppError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export const handleError = (error: unknown, fallbackMessage?: string) => {
  const defaultMessage = "Đã có lỗi xảy ra, vui lòng thử lại sau.";
  let message = fallbackMessage || defaultMessage;
  let status: number | undefined;

  if (isApiError(error)) {
    message = error.message || message;
    status = error.status;
  } else if (isAxiosError(error)) {
    message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      message;
    status = error.response?.status;
  } else if (error instanceof Error) {
    message = error.message;
  }

  toast.error(message);

  const logPrefix = status ? `[ErrorHandler ${status}]` : "[ErrorHandler]";

  if (error instanceof Error && error.message === message) {
    console.error(logPrefix, error);
  } else {
    console.error(logPrefix, message, error);
  }
};

function isApiError(error: unknown): error is ApiError {
  if (error instanceof AppError) return true;
  const err = error as Record<string, unknown>;
  return (
    !!error &&
    typeof error === "object" &&
    typeof err.message === "string" &&
    typeof err.status === "number"
  );
}

function isAxiosError(
  error: unknown,
): error is AxiosError<{
  message?: string;
  error?: string;
  errors?: string[];
}> {
  return axios.isAxiosError(error);
}
