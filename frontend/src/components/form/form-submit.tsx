import { IconLoader2 } from "@tabler/icons-react";
import type { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormContext } from "./form-context";

interface Props {
  children: ReactNode;
  className?: string;
}

export const FormSubmit: FC<Props> = ({ children, className }) => {
  const { pending } = useFormContext();

  return (
    <Button
      aria-disabled={pending}
      className={cn("w-full", className)}
      disabled={pending}
      type="submit"
    >
      {pending ? <IconLoader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
};
