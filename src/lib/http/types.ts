import type { AxiosRequestConfig } from "axios";

/** Shape of the error body the backend returns (adjust to your API contract). */
export interface ApiErrorBody {
  message?: string;
  code?: string;
  details?: unknown;
}

/** Normalized error thrown by every request made through the HTTP layer. */
export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly details: unknown;
  readonly isNetworkError: boolean;
  readonly isCanceled: boolean;

  constructor(options: {
    message: string;
    status?: number | null;
    code?: string | null;
    details?: unknown;
    isNetworkError?: boolean;
    isCanceled?: boolean;
  }) {
    super(options.message);
    this.name = "ApiError";
    this.status = options.status ?? null;
    this.code = options.code ?? null;
    this.details = options.details;
    this.isNetworkError = options.isNetworkError ?? false;
    this.isCanceled = options.isCanceled ?? false;
  }
}

/** Per-request options: all Axios config plus a few app-level helpers. */
export type RequestOptions = AxiosRequestConfig & {
  /** Skip attaching the auth token for this request. */
  skipAuth?: boolean;
};
