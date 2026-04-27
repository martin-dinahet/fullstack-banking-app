import { IconTag } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/features/categories/types";

interface CategoryBreakdownProps {
  categories: Category[];
  isLoading: boolean;
}

const categoryColors = [
  { bg: "bg-primary/10", text: "text-primary", icon: "○" },
  { bg: "bg-secondary/10", text: "text-secondary", icon: "○" },
  { bg: "bg-accent/10", text: "text-accent-foreground", icon: "○" },
  { bg: "bg-destructive/10", text: "text-destructive", icon: "○" },
  { bg: "bg-chart-3/10", text: "text-chart-3", icon: "○" },
];

export function CategoryBreakdown({ categories, isLoading }: CategoryBreakdownProps) {
  const topCategories = categories
    .filter((cat) => (cat.operationCount ?? 0) > 0)
    .sort((a, b) => (b.operationCount ?? 0) - (a.operationCount ?? 0))
    .slice(0, 5);

  const totalCount = topCategories.reduce((sum, cat) => sum + (cat.operationCount ?? 0), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`category-skeleton-${idx}`}
            className="flex animate-pulse items-center justify-between rounded-lg bg-muted/50 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex flex-col gap-1">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-3 w-12 rounded bg-muted" />
              </div>
            </div>
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (topCategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <IconTag className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No categories yet</p>
        <p className="mt-1 text-xs text-muted-foreground/70">Categories will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {topCategories.map((category, index) => {
        const percentage = totalCount > 0 ? ((category.operationCount ?? 0) / totalCount) * 100 : 0;
        const colors = categoryColors[index % categoryColors.length];

        return (
          <div
            key={category.id}
            className="group flex items-center justify-between rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.bg}`}>
                <IconTag className={`h-5 w-5 ${colors.text}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{category.title}</span>
                <span className="text-xs text-muted-foreground">
                  {category.operationCount} transaction{category.operationCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {percentage.toFixed(0)}%
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
