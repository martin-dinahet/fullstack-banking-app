import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { HealthStatus } from "@/features/health/components/health-status";

export const IndexPage: FC = () => {
  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl font-bold">Hello, World!</h1>
      <HealthStatus />
      <Button className="mt-4">Click me</Button>
    </div>
  );
};
