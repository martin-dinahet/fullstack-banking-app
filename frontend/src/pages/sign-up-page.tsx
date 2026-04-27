import type { FC } from "react";
import { SignUpForm } from "../features/auth/components/sign-up-form";
import { GuestGuard } from "@/lib/guards";

export const SignUpPage: FC = () => {
  return (
    <GuestGuard>
      <div className="min-h-screen font-sans p-6 flex items-center justify-center">
        <SignUpForm />
      </div>
    </GuestGuard>
  );
};
