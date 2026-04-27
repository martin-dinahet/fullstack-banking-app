import { useNavigate } from "react-router";
import { IconLogout } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setAuthToken } from "@/lib/api-fetch";
import { handle } from "@/lib/handle";
import { queryClient } from "@/lib/query-client";
import { fetchLogout } from "../features/auth/api/auth.api";
import { userKeys } from "../features/auth/hooks";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await handle(fetchLogout());
    setAuthToken(null);
    queryClient.setQueryData(userKeys.me(), null);
    toast.success("Logged out successfully");
    navigate("/sign-in");
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      <IconLogout className="h-[1.2rem] w-[1.2rem]" />
      Log out
    </Button>
  );
};
