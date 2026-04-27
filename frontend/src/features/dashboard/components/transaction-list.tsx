import { IconArrowUpLeft, IconArrowDownLeft, IconClipboardList } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import type { CreateOperationResponse } from "@/features/operations/api/operations.api";

interface TransactionListProps {
  transactions: CreateOperationResponse[];
  isLoading: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="flex animate-pulse items-center justify-between rounded-lg bg-muted/50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex flex-col gap-1">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
            </div>
            <div className="h-5 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <IconClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No transactions yet</p>
        <p className="mt-1 text-xs text-muted-foreground/70">Your recent transactions will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="group flex items-center justify-between rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                transaction.amount >= 0 ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
              }`}
            >
              {transaction.amount >= 0 ? (
                <IconArrowUpLeft className="h-5 w-5" />
              ) : (
                <IconArrowDownLeft className="h-5 w-5" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{transaction.label}</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {transaction.categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {cat.title}
                  </Badge>
                ))}
                <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
              </div>
            </div>
          </div>
          <span
            className={`text-sm font-bold ${
              transaction.amount >= 0 ? "text-green-600 dark:text-green-500" : "text-destructive"
            }`}
          >
            {transaction.amount >= 0 ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
