import { useMutation } from "@tanstack/react-query";
import { fetchLogin } from "../api/auth.api";

export const authKeys = {
  all: ["auth"] as const,
};

export function useLogin() {
  return useMutation({
    mutationKey: [...authKeys.all, "login"] as const,
    mutationFn: ({ email, password }: { email: string; password: string }) => fetchLogin(email, password),
  });
}
