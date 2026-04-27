import { IconPlus, IconClipboardList } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Category } from "@/features/categories/types";

interface QuickStatsProps {
  categories: Category[];
  onAddTransaction: () => void;
}

export function QuickStats({ categories, onAddTransaction }: QuickStatsProps) {
  const totalTransactions = categories.reduce(
    (sum, cat) => sum + (cat.operationCount ?? 0),
    0
  );

  return (
    <Card className="overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
      <div className="relative">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-4 backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{totalTransactions}</span>
              <span className="text-xs text-muted-foreground">Total Transactions</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
              <IconClipboardList className="h-6 w-6 text-secondary" />
            </div>
          </div>

          <Button onClick={onAddTransaction} className="w-full gap-2">
            <IconPlus className="h-4 w-4" data-icon="inline-start" />
            Add Transaction
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}