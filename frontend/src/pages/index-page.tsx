import { type FC, useEffect, useState } from "react";

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
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Hello, World!</h1>
      <div
        style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}
      >
        <h3>Backend Status:</h3>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!error && !data && <p>Loading...</p>}
        {data && (
          <pre style={{ background: "#f4f4f4", padding: "10px" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
