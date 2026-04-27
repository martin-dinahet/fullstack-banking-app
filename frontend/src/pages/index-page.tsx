import { useState } from "react";
import type { FC } from "react";
import { LogoutButton } from "@/components/logout-button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DashboardGrid,
  useDashboardData,
} from "@/features/dashboard";
import { AddTransactionDialog } from "@/features/dashboard/components/add-transaction-dialog";

export const IndexPage: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { summary, recentOperations, categories, isLoading, isError, refetch } =
    useDashboardData();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Track your finances</p>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="p-6">
        <DashboardGrid
          summary={summary}
          recentOperations={recentOperations}
          categories={categories}
          isLoading={isLoading}
          isError={isError}
          onAddTransaction={() => setIsDialogOpen(true)}
          onRetry={refetch}
        />
      </main>

      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        categories={categories}
      />
    </div>
  );
};