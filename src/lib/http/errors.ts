import axios from "axios";
import { ApiError, type ApiErrorBody } from "./types";

/** Converts any thrown value (Axios or otherwise) into an ApiError. */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isCancel(error)) {
    return new ApiError({ message: "Request was canceled", isCanceled: true });
  }

  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const status = error.response?.status ?? null;
    const body = error.response?.data;

    if (!error.response) {
      return new ApiError({
        message: "Network error: unable to reach the server",
        code: error.code ?? "NETWORK_ERROR",
        isNetworkError: true,
      });
    }

    return new ApiError({
      message: body?.message ?? error.message ?? `Request failed with status ${status}`,
      status,
      code: body?.code ?? error.code ?? null,
      details: body?.details ?? body,
    });
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message });
  }

  return new ApiError({ message: "An unknown error occurred" });
}
