import { useMutation } from "@tanstack/react-query";
import { type CreateOperationRequest, createOperation } from "../api/operations.api";

export function useCreateOperation() {
  return useMutation({
    mutationFn: (data: CreateOperationRequest) => createOperation(data),
  });
}
