import { useMutation } from "@tanstack/react-query";
import { fetchRegister } from "../api/auth.api";
import { authKeys } from "./use-login";

export function useRegister() {
  return useMutation({
    mutationKey: [...authKeys.all, "register"] as const,
    mutationFn: ({ email, password }: { email: string; password: string }) => fetchRegister(email, password),
  });
}
