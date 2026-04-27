import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/lib/auth-context";

export const GuestGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};
