import { fetchClient } from "@/lib/api-fetch";

export interface CreateCategoryRequest {
  title: string;
}

export interface CreateCategoryResponse {
  id: number;
  title: string;
  operationCount: number;
}

export async function createCategory(body: CreateCategoryRequest): Promise<CreateCategoryResponse> {
  return fetchClient<CreateCategoryResponse>("/api/categories", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type GetCategoriesResponse = CreateCategoryResponse[];

export async function getCategories(): Promise<GetCategoriesResponse> {
  return fetchClient<GetCategoriesResponse>("/api/categories");
}


export async function getCategory(id: number): Promise<CreateCategoryResponse> {
  return fetchClient<CreateCategoryResponse>(`/api/categories/${id}`);
}

export interface UpdateCategoryRequest {
  id: number;
  title: string;
}

export async function updateCategory({ id, ...body }: UpdateCategoryRequest): Promise<CreateCategoryResponse> {
  return fetchClient<CreateCategoryResponse>(`/api/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return fetchClient<void>(`/api/categories/${id}`, {
    method: "DELETE",
  });
}
