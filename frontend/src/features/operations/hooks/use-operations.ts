import { useQuery } from "@tanstack/react-query";
import { type GetOperationsParams, getOperations } from "../api/operations.api";

export function useOperations(params?: GetOperationsParams) {
  return useQuery({
    queryKey: ["operations", params],
    queryFn: () => getOperations(params),
  });
}
