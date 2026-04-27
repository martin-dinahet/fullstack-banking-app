import { fetchClient } from "@/lib/api-fetch";

export interface CreateOperationRequest {
  label: string;
  amount: number;
  date: string;
  category_ids: number[];
}

export interface OperationCategory {
  id: number;
  title: string;
}

export interface CreateOperationResponse {
  id: number;
  label: string;
  amount: number;
  date: string;
  categories: OperationCategory[];
}

export async function createOperation(body: CreateOperationRequest): Promise<CreateOperationResponse> {
  return fetchClient<CreateOperationResponse>("/api/operations", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export interface GetOperationsParams {
  category_id?: number;
  from?: string;
  to?: string;
}

export type GetOperationsResponse = CreateOperationResponse[];

export async function getOperations(params?: GetOperationsParams): Promise<GetOperationsResponse> {
  const query = new URLSearchParams();
  if (params?.category_id !== undefined) query.set("category_id", String(params.category_id));
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);
  const qs = query.size ? `?${query}` : "";
  return fetchClient<GetOperationsResponse>(`/api/operations${qs}`);
}

export async function getOperation(id: number): Promise<CreateOperationResponse> {
  return fetchClient<CreateOperationResponse>(`/api/operations/${id}`);
}

export interface UpdateOperationRequest {
  id: number;
  label?: string;
  amount?: number;
  date?: string;
  category_ids?: number[];
}

export async function updateOperation({ id, ...body }: UpdateOperationRequest): Promise<CreateOperationResponse> {
  return fetchClient<CreateOperationResponse>(`/api/operations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export interface OperationsSummaryResponse {
  total_income: number;
  total_expense: number;
  balance: number;
  count: number;
}

export async function getOperationsSummary(): Promise<OperationsSummaryResponse> {
  return fetchClient<OperationsSummaryResponse>("/api/operations/summary");
}

export async function deleteOperation(id: number): Promise<void> {
  return fetchClient<void>(`/api/operations/${id}`, {
    method: "DELETE",
  });
}
