import { useQuery } from "@tanstack/react-query";
import { getOperation } from "../api/operations.api";

export function useOperation(id: number) {
  return useQuery({
    queryKey: ["operations", id],
    queryFn: () => getOperation(id),
  });
}
