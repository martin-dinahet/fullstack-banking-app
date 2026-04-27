import { useNavigate } from "react-router";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import z from "zod";
import type { Result } from "@/lib/types/result";
import { handle } from "@/lib/handle";
import { parseFormData } from "../utils";
import { signUpEmail, signInEmail } from "../api/auth.api";
import type { RegisterResponse, LoginResponse } from "../api/auth.api";
import { userKeys } from "./use-me";
import { queryClient } from "@/lib/query-client";
import { setAuthToken } from "@/lib/api-fetch";

export const useSignUpForm = () => {
  const navigate = useNavigate();
  const [pending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const schema = z
    .object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password is required"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const action = (formData: FormData) => {
    startTransition(async () => {
      const { data, fieldErrors: errors } = parseFormData(schema, formData);
      if (errors) {
        setFieldErrors(errors);
        return;
      }

      const result: Result<RegisterResponse> = await handle(signUpEmail(data.email, data.password));
      if (result.error) {
        setGlobalError(result.error);
        return;
      }

      toast.success("Account created successfully");

      const loginResult: Result<LoginResponse> = await handle(signInEmail(data.email, data.password));
      if (loginResult.data?.token) {
        setAuthToken(loginResult.data.token);
        queryClient.invalidateQueries({ queryKey: userKeys.me() });
      }

      navigate("/");
    });
  };

  return { action, fieldErrors, globalError, pending };
};
