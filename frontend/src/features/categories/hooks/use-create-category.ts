import { useMutation } from "@tanstack/react-query";
import { type CreateCategoryRequest, createCategory } from "../api/categories.api";

export function useCreateCategory() {
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
  });
}
