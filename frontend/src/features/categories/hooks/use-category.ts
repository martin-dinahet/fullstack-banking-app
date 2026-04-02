import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../api/categories.api";

export function useCategory(id: number) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategory(id),
  });
}
