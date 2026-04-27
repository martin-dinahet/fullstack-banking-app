import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/test/setup";
import { renderWithProviders } from "@/test/test-utils";
import { HealthStatus } from "./health-status";

describe("HealthStatus", () => {
  it("shows the backend status when the API succeeds", async () => {
    server.use(
      http.get("/api/health", () => {
        return HttpResponse.json({ status: "ok" });
      }),
    );
    renderWithProviders(<HealthStatus />);
    const statusData = await screen.findByText(/"status": "ok"/i);
    expect(statusData).toBeInTheDocument();
    expect(screen.getByText(/Backend Status/i)).toBeInTheDocument();
  });

  it("shows an error message when the API fails with 500", async () => {
    server.use(
      http.get("/api/health", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    renderWithProviders(<HealthStatus />);
    const errorMsg = await screen.findByText(/Something went wrong. Please try again./i);
    expect(errorMsg).toBeInTheDocument();
  });

  it("shows the loading state initially", async () => {
    server.use(
      http.get("/api/health", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({ status: "ok" });
      }),
    );
    renderWithProviders(<HealthStatus />);
    const loadingMsg = await screen.findByText(/Loading\.\.\./i);
    expect(loadingMsg).toBeInTheDocument();
  });
});
