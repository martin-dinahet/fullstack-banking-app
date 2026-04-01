import { IconAlertCircle, IconEye, IconEyeOff } from "@tabler/icons-react";
import { type ComponentPropsWithoutRef, type FC, type ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext } from "./form-context";

interface Props
  extends Omit<ComponentPropsWithoutRef<typeof Input>, "form" | "value" | "onChange"> {
  hidden?: boolean;
  icon?: ReactNode;
  label?: string;
  name: string;
}

export const FormField: FC<Props> = ({
  icon,
  label,
  name,
  hidden,
  type = "text",
  ...inputProps
}) => {
  const { state, pending, formId, values, setField } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;
  const error = state.fieldErrors?.[name];
  const inputId = `${formId}-${name}`;
  const errorId = `${formId}-${name}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", hidden && "hidden")}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3 text-muted-foreground">{icon}</span>
        )}
        <Input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            icon && "pl-9",
            isPassword && "pr-9",
            error && "border-destructive focus-visible:ring-destructive",
          )}
          disabled={pending}
          id={inputId}
          name={name}
          type={resolvedType}
          value={values[name] ?? ""}
          onChange={(e) => setField(name, e.target.value)}
          {...inputProps}
        />
        {isPassword && (
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            type="button"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
          </button>
        )}
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
