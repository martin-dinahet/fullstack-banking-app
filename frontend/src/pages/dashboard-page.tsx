import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { HealthStatus } from "@/features/health/components/health-status";

export const DashboardPage: FC = () => {
  return (
    <div className="min-h-screen font-sans p-6">
      <div className="flex justify-end gap-2">
        <LogoutButton />
        <ModeToggle />
      </div>

      <main className="flex flex-col gap-4 mt-6">
        <HealthStatus />
        <div className="flex gap-2">
          <Button variant={"default"}>Default</Button>
          <Button variant={"destructive"}>Destructive</Button>
          <Button variant={"ghost"}>Ghost</Button>
          <Button variant={"outline"}>Outline</Button>
          <Button variant={"secondary"}>Secondary</Button>
        </div>
      </main>
    </div>
  );
};
