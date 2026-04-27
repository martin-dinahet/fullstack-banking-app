import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Result } from "@/lib/types/result";
import { handle } from "@/lib/handle";
import { userKeys } from "../features/auth/hooks";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/query-client";
import { IconLogout } from "@tabler/icons-react";
import { fetchLogout } from "../features/auth/api/auth.api";
import { setAuthToken } from "@/lib/api-fetch";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result: Result<void> = await handle(fetchLogout());
    if (result.error) {
      return;
    }
    toast.success("Logged out successfully");
    setAuthToken(null);
    queryClient.removeQueries({ queryKey: userKeys.me() });
    navigate("/sign-in");
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      <IconLogout className="h-[1.2rem] w-[1.2rem]" />
      Log out
    </Button>
  );
};
