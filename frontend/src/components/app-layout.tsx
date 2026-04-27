import { Outlet } from "react-router";
import { AuthGuard } from "@/lib/guards";

export const AppLayout = () => {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  );
};
