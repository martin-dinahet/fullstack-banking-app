import { IconLoader2, IconLogout } from "@tabler/icons-react";
import type { FC } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLogout } from "../hooks/use-logout";

export const LogoutButton: FC = () => {
  const logout = useLogout();

  return (
    <Button
      variant="secondary"
      disabled={logout.isPending}
      onClick={() =>
        logout.mutate(undefined, {
          onSuccess: () => toast.success("Signed out successfully."),
          onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to sign out."),
        })
      }
    >
      {logout.isPending ? <IconLoader2 className="h-4 w-4 animate-spin" /> : <IconLogout className="h-4 w-4" />}
      {logout.isPending ? "Signing out…" : "Sign out"}
    </Button>
  );
};
