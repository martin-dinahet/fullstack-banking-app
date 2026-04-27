import { fetchClient } from "@/lib/api-fetch";
import type { HealthResponse } from "../types";

export type { HealthResponse };

export async function fetchHealth(): Promise<HealthResponse> {
  return fetchClient<HealthResponse>("/api/health");
}
