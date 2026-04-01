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
