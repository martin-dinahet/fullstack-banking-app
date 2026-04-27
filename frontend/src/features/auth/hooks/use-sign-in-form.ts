import { useNavigate } from "react-router";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import z from "zod";
import type { Result } from "@/lib/types/result";
import { handle } from "@/lib/handle";
import { parseFormData } from "../utils";
import { signInEmail } from "../api/auth.api";
import type { LoginResponse } from "../api/auth.api";
import { userKeys } from "./use-me";
import { queryClient } from "@/lib/query-client";
import { setAuthToken } from "@/lib/api-fetch";

export const useSignInForm = () => {
  const navigate = useNavigate();
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  const action = (formData: FormData) => {
    startTransition(async () => {
      const { data, fieldErrors } = parseFormData(schema, formData);
      if (fieldErrors) {
        setFieldErrors(fieldErrors);
        return;
      }

      const result: Result<LoginResponse> = await handle(signInEmail(data.email, data.password));
      if (result.error) {
        setGlobalError(result.error);
        return;
      }

      if (result.data?.token) {
        setAuthToken(result.data.token);
      }

      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      navigate("/");
    });
  };

  return { action, fieldErrors, globalError, pending };
};
