import { IconLogout } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setAuthToken } from "@/lib/api-fetch";
import { handle } from "@/lib/handle";
import { fetchLogout } from "../features/auth/api/auth.api";

export const LogoutButton = () => {
  const handleLogout = async () => {
    await handle(fetchLogout());
    setAuthToken(null);
    toast.success("Logged out successfully");
    window.location.href = "/sign-in";
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      <IconLogout className="h-[1.2rem] w-[1.2rem]" />
      Log out
    </Button>
  );
};