import { useMutation } from "@tanstack/react-query";
import { deleteOperation } from "../api/operations.api";

export function useDeleteOperation() {
  return useMutation({
    mutationFn: (id: number) => deleteOperation(id),
  });
}
