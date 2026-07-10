import { useState } from "react";
import { IconArrowUpLeft, IconArrowDownLeft, IconClipboardList } from "@tabler/icons-react";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteOperation } from "@/features/operations/hooks/use-delete-operation";
import type { CreateOperationResponse } from "@/features/operations/api/operations.api";
import type { Category } from "@/features/categories/types";
import { AddTransactionDialog } from "./add-transaction-dialog";

interface TransactionListProps {
  transactions: CreateOperationResponse[];
  categories: Category[];
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

export function TransactionList({ transactions, categories, isLoading }: TransactionListProps) {
  const queryClient = useQueryClient();
  const deleteOperationMutation = useDeleteOperation();
  const [editingTransaction, setEditingTransaction] = useState<CreateOperationResponse | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<CreateOperationResponse | null>(null);

  const handleDelete = () => {
    if (!deletingTransaction) return;

    deleteOperationMutation.mutate(deletingTransaction.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["operations"] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Transaction deleted successfully");
        setDeletingTransaction(null);
      },
      onError: () => {
        toast.error("Failed to delete transaction");
      },
    });
  };

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
    <>
      <div className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="group flex items-center justify-between gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-muted/30"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  transaction.amount >= 0 ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                }`}
              >
                {transaction.amount >= 0 ? (
                  <IconArrowUpLeft className="h-5 w-5" />
                ) : (
                  <IconArrowDownLeft className="h-5 w-5" />
                )}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{transaction.label}</span>
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
            <div className="flex shrink-0 items-center gap-1">
              <span
                className={`mr-1 text-sm font-bold ${
                  transaction.amount >= 0 ? "text-green-600 dark:text-green-500" : "text-destructive"
                }`}
              >
                {transaction.amount >= 0 ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${transaction.label}`}
                title="Edit transaction"
                onClick={() => setEditingTransaction(transaction)}
              >
                <IconPencil />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                aria-label={`Delete ${transaction.label}`}
                title="Delete transaction"
                onClick={() => setDeletingTransaction(transaction)}
              >
                <IconTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AddTransactionDialog
        open={editingTransaction !== null}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        categories={categories}
        transaction={editingTransaction}
      />

      <AlertDialog open={deletingTransaction !== null} onOpenChange={(open) => !open && setDeletingTransaction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{deletingTransaction?.label}" from your account history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteOperationMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteOperationMutation.isPending}
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
