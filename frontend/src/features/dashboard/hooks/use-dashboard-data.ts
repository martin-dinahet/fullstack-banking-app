import { useOperations } from "@/features/operations/hooks/use-operations";
import { useOperationsSummary } from "@/features/operations/hooks/use-operations-summary";
import { useCategories } from "@/features/categories/hooks/use-categories";

export function useDashboardData() {
  const summaryQuery = useOperationsSummary();
  const operationsQuery = useOperations();
  const categoriesQuery = useCategories();

  const isLoading = summaryQuery.isLoading || operationsQuery.isLoading || categoriesQuery.isLoading;

  const isError = summaryQuery.isError || operationsQuery.isError || categoriesQuery.isError;

  const error = summaryQuery.error ?? operationsQuery.error ?? categoriesQuery.error;

  const recentOperations = operationsQuery.data?.slice(0, 10) ?? [];

  return {
    summary: summaryQuery.data,
    recentOperations,
    categories: categoriesQuery.data ?? [],
    isLoading,
    isError,
    error,
    refetch: () => {
      summaryQuery.refetch();
      operationsQuery.refetch();
      categoriesQuery.refetch();
    },
  };
}
