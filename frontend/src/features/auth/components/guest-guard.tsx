import { Navigate, Outlet } from "react-router";
import { useMe } from "../hooks/use-me";

export const GuestGuard = () => {
  const { data: me, isLoading } = useMe();
  if (isLoading) return null;
  if (me) return <Navigate to="/" replace />;

  return <Outlet />;
};
