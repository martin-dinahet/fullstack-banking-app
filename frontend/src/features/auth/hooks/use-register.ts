import { useMutation } from "@tanstack/react-query";
import { type RegisterRequest, registerUser } from "../api/auth.api";

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
  });
}
