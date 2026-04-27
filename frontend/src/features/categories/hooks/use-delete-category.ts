import { useMutation } from "@tanstack/react-query";
import { deleteCategory } from "../api/categories.api";

export function useDeleteCategory() {
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
  });
}
