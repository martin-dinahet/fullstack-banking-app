import { fetchClient } from "@/lib/api-fetch";

export interface HealthResponse {
  status: string;
}

export async function fetchHealth(): Promise<HealthResponse> {
  return fetchClient<HealthResponse>("/api/health");
}
