// biome-ignore-all lint/suspicious/noExplicitAny: we have to

import type { UseMutationResult } from "@tanstack/react-query";

import { createContext, useContext } from "react";

interface FormState {
  message?: string;
  status?: "idle" | "success" | "error";
  fieldErrors?: Record<string, string | undefined>;
}

interface FormContextValue {
  state: FormState;
  pending: boolean;
  formId: string;
  values: Record<string, string>;
  setField: (name: string, value: string) => void;
  mutation: UseMutationResult<any, Error, any, any>;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used within <Form.Root>");
  return ctx;
}
