export interface Category {
  id: number;
  title: string;
  operationCount: number;
}

export interface CreateCategoryRequest {
  title: string;
}

export interface UpdateCategoryRequest {
  id: number;
  title: string;
}
