import { fetchClient } from "@/lib/api-fetch";

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
  id: number;
}

export interface UserResponse {
  id: number;
  email: string;
  roles: string[];
}

export async function fetchLogin(email: string, password: string): Promise<LoginResponse> {
  return fetchClient<LoginResponse>("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export const signInEmail = fetchLogin;

export async function fetchRegister(email: string, password: string): Promise<RegisterResponse> {
  return fetchClient<RegisterResponse>("/api/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export const signUpEmail = fetchRegister;

export async function fetchMe(): Promise<UserResponse> {
  return fetchClient<UserResponse>("/api/me");
}

export async function fetchLogout(): Promise<void> {
  return fetchClient<void>("/api/logout", {
    method: "POST",
  });
}
