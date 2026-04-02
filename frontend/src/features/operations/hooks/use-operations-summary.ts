import { useQuery } from "@tanstack/react-query";
import { getOperationsSummary } from "../api/operations.api";

export function useOperationsSummary() {
  return useQuery({
    queryKey: ["operations", "summary"],
    queryFn: () => getOperationsSummary(),
  });
}
