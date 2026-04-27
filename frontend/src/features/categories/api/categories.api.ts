import { fetchClient } from "@/lib/api-fetch";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../types";

export type { Category, CreateCategoryRequest, UpdateCategoryRequest };

export async function createCategory(body: CreateCategoryRequest): Promise<Category> {
  return fetchClient<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getCategories(): Promise<Category[]> {
  return fetchClient<Category[]>("/api/categories");
}

export async function getCategory(id: number): Promise<Category> {
  return fetchClient<Category>(`/api/categories/${id}`);
}

export async function updateCategory({ id, ...body }: UpdateCategoryRequest): Promise<Category> {
  return fetchClient<Category>(`/api/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return fetchClient<void>(`/api/categories/${id}`, {
    method: "DELETE",
  });
}