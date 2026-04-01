import type { FC } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export const LoginPage: FC = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <LoginForm />
    </div>
  );
};
