import type { ComponentType } from "react";
import { GuestGuard } from "@/lib/guards";

export const withGuestGuard = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => (
    <GuestGuard>
      <Component {...props} />
    </GuestGuard>
  );
};
