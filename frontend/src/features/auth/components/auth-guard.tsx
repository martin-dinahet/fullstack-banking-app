import type { FC } from "react";
import { Navigate, Outlet } from "react-router";
import { useMe } from "../hooks/use-me";

export const AuthGuard: FC = () => {
  const { data: me, isLoading } = useMe();
  if (isLoading) return null;
  if (!me) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
};
