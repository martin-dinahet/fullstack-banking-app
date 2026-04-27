import { useMutation } from "@tanstack/react-query";
import { type UpdateOperationRequest, updateOperation } from "../api/operations.api";

export function useUpdateOperation() {
  return useMutation({
    mutationFn: (data: UpdateOperationRequest) => updateOperation(data),
  });
}
