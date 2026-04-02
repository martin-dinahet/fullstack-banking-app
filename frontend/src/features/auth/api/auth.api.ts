import { fetchClient } from "@/lib/api-fetch";

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  id: number;
}

export async function registerUser(body: RegisterRequest): Promise<RegisterResponse> {
  return fetchClient<RegisterResponse>("/api/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function loginUser(body: LoginRequest): Promise<LoginResponse> {
  return fetchClient<LoginResponse>("/api/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export interface MeResponse {
  id: number;
  email: string;
  roles: string[];
}

export async function fetchMe(): Promise<MeResponse> {
  return fetchClient<MeResponse>("/api/me");
}

export async function logoutUser() {
  return fetchClient<void>("/api/logout", { method: "POST" });
}
