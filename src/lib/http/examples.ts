import { http } from "./client";

// ---------------------------------------------------------------------------
// 1. POST with a raw JSON body
//    The instance default Content-Type is application/json, and plain objects
//    are serialized automatically.
// ---------------------------------------------------------------------------

interface CreateUserPayload {
  name: string;
  email: string;
  roles: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export function createUserJson(payload: CreateUserPayload) {
  return http.post<User, CreateUserPayload>("/users", payload);
}

// Usage:
// const user = await createUserJson({ name: "Ada", email: "ada@example.com", roles: ["admin"] });

// ---------------------------------------------------------------------------
// 2. POST with form data (multipart/form-data)
//    Use FormData for file uploads or when the server expects form fields.
//    The client removes the JSON Content-Type for FormData automatically.
// ---------------------------------------------------------------------------

interface UploadResult {
  id: string;
  url: string;
}

export function uploadAvatar(userId: string, file: File, caption?: string) {
  const form = new FormData();
  form.append("userId", userId);
  form.append("avatar", file); // the File's name is sent as the filename
  if (caption) form.append("caption", caption);

  return http.post<UploadResult, FormData>("/users/avatar", form);
}

// Usage with an <input type="file"> change handler:
// const file = event.target.files?.[0];
// if (file) await uploadAvatar("42", file, "Profile photo");

// ---------------------------------------------------------------------------
// 3. Form-encoded (application/x-www-form-urlencoded) body, for servers that
//    expect classic HTML form posts. Uses URLSearchParams and overrides the
//    JSON Content-Type for this request only.
// ---------------------------------------------------------------------------

export function login(username: string, password: string) {
  const body = new URLSearchParams({ username, password });

  return http.post<{ accessToken: string }, URLSearchParams>("/auth/login", body, {
    skipAuth: true,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}
