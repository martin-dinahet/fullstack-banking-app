import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import type { OperationsSummaryResponse } from "@/features/operations/api/operations.api";

interface BalanceSummaryCardProps {
  summary: OperationsSummaryResponse | undefined;
  isLoading: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function BalanceSummaryCard({ summary, isLoading }: BalanceSummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="lg:col-span-2 overflow-hidden">
        <div className="relative px-6 pt-8 pb-6">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
          <div className="relative">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Net Balance</span>
            <div className="mt-2 h-12 w-48 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </Card>
    );
  }

  const balance = summary?.balance ?? 0;
  const isPositive = balance >= 0;

  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-secondary/5" />
      <div className="relative px-6 pt-8 pb-6">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Net Balance</span>
        <div className="mt-2">
          <span className={`text-5xl font-bold tracking-tight ${isPositive ? "text-primary" : "text-destructive"}`}>
            {formatCurrency(balance)}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-background/40 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                <IconArrowUp className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Income</span>
            </div>
            <span className="text-xl font-bold text-green-600 dark:text-green-500">
              +{formatCurrency(summary?.total_income ?? 0)}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-background/40 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/20">
                <IconArrowDown className="h-3 w-3 text-destructive" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Expenses</span>
            </div>
            <span className="text-xl font-bold text-destructive">{formatCurrency(summary?.total_expense ?? 0)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
