// biome-ignore-all lint/suspicious/noExplicitAny: we have to
import type { UseMutationResult } from "@tanstack/react-query";
import {
  type FC,
  type ReactNode,
  type SubmitEvent,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { FormContext } from "./form-context";

interface Props {
  mutation: UseMutationResult<any, Error, any, any>;
  defaultValues?: Record<string, string>;
  children: ReactNode;
  className?: string;
  onSuccess?: (data: any) => void;
  successMessage?: string;
}

export const FormRoot: FC<Props> = ({
  mutation,
  defaultValues = {},
  children,
  className,
  onSuccess,
  successMessage,
}) => {
  const formId = useId();
  const [values, setValues] = useState<Record<string, string>>(defaultValues);
  const [isPending, startTransition] = useTransition();
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const setField = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    startTransition(() => {
      mutation.mutate(values, {
        onSuccess: (data) => {
          onSuccessRef.current?.(data);
        },
      });
    });
  };

  const state = {
    status: mutation.isSuccess
      ? ("success" as const)
      : mutation.isError
        ? ("error" as const)
        : ("idle" as const),
    message: mutation.isSuccess ? successMessage : undefined,
    fieldErrors: {},
  };

  return (
    <FormContext.Provider
      value={{
        state,
        pending: isPending || mutation.isPending,
        formId,
        values,
        setField,
        mutation,
      }}
    >
      <form className={className} noValidate onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
};
