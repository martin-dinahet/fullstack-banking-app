import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IconReload } from "@tabler/icons-react";
import { BalanceSummaryCard } from "./balance-summary-card";
import { QuickStats } from "./quick-stats";
import { TransactionList } from "./transaction-list";
import { CategoryBreakdown } from "./category-breakdown";
import { DashboardSkeleton } from "./dashboard-skeleton";
import type { OperationsSummaryResponse, CreateOperationResponse } from "@/features/operations/api/operations.api";
import type { Category } from "@/features/categories/types";

interface DashboardGridProps {
  summary: OperationsSummaryResponse | undefined;
  recentOperations: CreateOperationResponse[];
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  onAddTransaction: () => void;
  onRetry: () => void;
}

export function DashboardGrid({
  summary,
  recentOperations,
  categories,
  isLoading,
  isError,
  onAddTransaction,
  onRetry,
}: DashboardGridProps) {
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <p>Failed to load dashboard data.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <IconReload className="h-4 w-4" />
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BalanceSummaryCard summary={summary} isLoading={isLoading} />
        <QuickStats categories={categories} onAddTransaction={onAddTransaction} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
              <span className="text-xs text-muted-foreground">
                {recentOperations.length} transactions
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={recentOperations} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Categories</CardTitle>
              <span className="text-xs text-muted-foreground">
                {categories.filter((c) => (c.operationCount ?? 0) > 0).length} active
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryBreakdown categories={categories} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}