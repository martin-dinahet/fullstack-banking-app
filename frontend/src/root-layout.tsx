import type { FC } from "react";
import { Outlet } from "react-router";

export const RootLayout: FC = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
