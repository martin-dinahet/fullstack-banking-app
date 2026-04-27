import type { FC } from "react";
import { GuestGuard } from "@/lib/guards";
import { LoginForm } from "../features/auth/components/login-form";

export const LoginPage: FC = () => {
  return (
    <GuestGuard>
      <div className="min-h-screen font-sans p-6 flex items-center justify-center">
        <LoginForm />
      </div>
    </GuestGuard>
  );
};
