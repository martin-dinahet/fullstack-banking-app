import type { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealth } from "../hooks/use-health";

export const HealthStatus: FC = () => {
  const { data, error, isLoading } = useHealth();

  return (
    <Card className="mt-5 max-w-sm">
      <CardHeader>
        <CardTitle className="text-base">Backend Status</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <Badge variant="destructive">Error: {error.message}</Badge>}
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {data && (
          <pre className="bg-muted rounded p-3 text-sm">{JSON.stringify(data, null, 2)}</pre>
        )}
      </CardContent>
    </Card>
  );
};
