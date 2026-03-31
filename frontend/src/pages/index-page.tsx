import { type FC, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthResponse {
  status: string;
}

export const IndexPage: FC = () => {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl font-bold">Hello, World!</h1>

      <Card className="mt-5 max-w-sm">
        <CardHeader>
          <CardTitle className="text-base">Backend Status</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <Badge variant="destructive">Error: {error}</Badge>}
          {!error && !data && (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}
          {data && (
            <pre className="bg-muted rounded p-3 text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      <Button className="mt-4">Click me</Button>
    </div>
  );
};
