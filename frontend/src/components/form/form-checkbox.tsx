import { IconAlertCircle } from "@tabler/icons-react";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFormContext } from "./form-context";

interface Props extends Omit<ComponentPropsWithoutRef<typeof Checkbox>, "form"> {
  label: string;
  name: string;
}

export const FormCheckbox: FC<Props> = ({ label, name, ...inputProps }) => {
  const { state, pending, formId } = useFormContext();
  const error = state.fieldErrors?.[name];
  const inputId = `${formId}-${name}`;
  const errorId = `${formId}-${name}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Checkbox
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          disabled={pending}
          id={inputId}
          name={name}
          {...inputProps}
        />
        <Label className="cursor-pointer" htmlFor={inputId}>
          {label}
        </Label>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-destructive text-sm" id={errorId} role="alert">
          <IconAlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
