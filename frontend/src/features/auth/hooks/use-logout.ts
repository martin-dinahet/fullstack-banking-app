import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { fetchLogout } from "../api/auth.api";
import { userKeys } from "./use-me";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      queryClient.setQueryData(userKeys.me(), null);
      navigate("/auth/login");
    },
  });
}
