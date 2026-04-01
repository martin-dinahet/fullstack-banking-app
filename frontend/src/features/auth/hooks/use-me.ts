import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/auth.api";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchMe,
    retry: false,
  });
}
