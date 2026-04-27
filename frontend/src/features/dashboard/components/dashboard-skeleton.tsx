import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" data-testid="dashboard-skeleton">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="relative px-6 pt-8 pb-6">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
            <div className="relative">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-12 w-48" />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="relative">
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-20" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </CardContent>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={`transactions-skeleton-${idx}`} className="h-16 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={`category-skeleton-${idx}`} className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
