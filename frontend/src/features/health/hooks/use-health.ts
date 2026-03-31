import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "../api/health.api";

export const healthKeys = {
  all: ["health"] as const,
  status: () => [...healthKeys.all, "status"] as const,
};

export function useHealth() {
  return useQuery({
    queryKey: healthKeys.status(),
    queryFn: fetchHealth,
  });
}
