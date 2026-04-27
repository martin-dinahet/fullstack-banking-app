import { useMutation } from "@tanstack/react-query";
import { type UpdateCategoryRequest, updateCategory } from "../api/categories.api";

export function useUpdateCategory() {
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => updateCategory(data),
  });
}
