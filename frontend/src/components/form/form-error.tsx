import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";
import type { FC } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormContext } from "./form-context";

export const FormError: FC = () => {
  const { state } = useFormContext();
  const rootError = state.fieldErrors?.root;
  const message = state.message;

  if (!(rootError || message)) return null;

  return (
    <div className="flex flex-col gap-2">
      {rootError && (
        <Alert role="alert" variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>{rootError}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert role="status">
          <IconCircleCheck className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
