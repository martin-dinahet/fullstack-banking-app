import type { FC } from "react";
import { Outlet } from "react-router";
import { Toaster } from "./components/ui/sonner";

export const RootLayout: FC = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};
