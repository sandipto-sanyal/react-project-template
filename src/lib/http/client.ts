import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { normalizeError } from "./errors";
import type { RequestOptions } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000);

let authToken: string | null = null;

/** Set (or clear with null) the bearer token attached to authenticated requests. */
export function setAuthToken(token: string | null) {
  authToken = token;
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const { skipAuth } = config as RequestOptions;
  if (!skipAuth && authToken) {
    config.headers.set("Authorization", `Bearer ${authToken}`);
  }

  // The instance defaults to JSON. For FormData, drop that header so the browser
  // sets `multipart/form-data` with the correct boundary; otherwise Axios would
  // serialize the FormData as JSON.
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);

/**
 * Performs a request and returns only the response body.
 * Throws an ApiError on failure.
 */
async function request<T>(config: RequestOptions): Promise<T> {
  const response: AxiosResponse<T> = await httpClient.request<T>(config);
  return response.data;
}

export const http = {
  get<T>(url: string, options?: RequestOptions) {
    return request<T>({ ...options, method: "GET", url });
  },
  post<T, B = unknown>(url: string, body?: B, options?: RequestOptions) {
    return request<T>({ ...options, method: "POST", url, data: body });
  },
  put<T, B = unknown>(url: string, body?: B, options?: RequestOptions) {
    return request<T>({ ...options, method: "PUT", url, data: body });
  },
  patch<T, B = unknown>(url: string, body?: B, options?: RequestOptions) {
    return request<T>({ ...options, method: "PATCH", url, data: body });
  },
  delete<T>(url: string, options?: RequestOptions) {
    return request<T>({ ...options, method: "DELETE", url });
  },
};
