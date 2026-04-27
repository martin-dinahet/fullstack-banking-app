import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { DashboardGrid } from "../components/dashboard-grid";
import type { OperationsSummaryResponse, CreateOperationResponse } from "@/features/operations/api/operations.api";
import type { Category } from "@/features/categories/types";

describe("DashboardGrid", () => {
  const mockSummary: OperationsSummaryResponse = {
    total_income: 5000,
    total_expense: -2500,
    balance: 2500,
    count: 15,
  };

  const mockOperations: CreateOperationResponse[] = [
    {
      id: 1,
      label: "Salary",
      amount: 5000,
      date: "2024-06-15",
      categories: [{ id: 1, title: "Income" }],
    },
  ];

  const mockCategories: Category[] = [
    { id: 1, title: "Food", operationCount: 10 },
  ];

  it("shows skeleton while loading", () => {
    renderWithProviders(
      <DashboardGrid
        summary={undefined}
        recentOperations={[]}
        categories={[]}
        isLoading={true}
        isError={false}
        onAddTransaction={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByTestId("dashboard-skeleton")).toBeInTheDocument();
  });

  it("shows error alert when isError is true", () => {
    renderWithProviders(
      <DashboardGrid
        summary={undefined}
        recentOperations={[]}
        categories={[]}
        isLoading={false}
        isError={true}
        onAddTransaction={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const onRetry = vi.fn();
    renderWithProviders(
      <DashboardGrid
        summary={undefined}
        recentOperations={[]}
        categories={[]}
        isLoading={false}
        isError={true}
        onAddTransaction={vi.fn()}
        onRetry={onRetry}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("displays balance summary card", () => {
    renderWithProviders(
      <DashboardGrid
        summary={mockSummary}
        recentOperations={mockOperations}
        categories={mockCategories}
        isLoading={false}
        isError={false}
        onAddTransaction={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText("Net Balance")).toBeInTheDocument();
    expect(screen.getByText("$2,500.00")).toBeInTheDocument();
  });

  it("displays quick stats with transaction count", () => {
    renderWithProviders(
      <DashboardGrid
        summary={mockSummary}
        recentOperations={mockOperations}
        categories={mockCategories}
        isLoading={false}
        isError={false}
        onAddTransaction={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("displays recent transactions section", () => {
    renderWithProviders(
      <DashboardGrid
        summary={mockSummary}
        recentOperations={mockOperations}
        categories={mockCategories}
        isLoading={false}
        isError={false}
        onAddTransaction={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
  });

  it("displays categories section", () => {
    renderWithProviders(
      <DashboardGrid
        summary={mockSummary}
        recentOperations={mockOperations}
        categories={mockCategories}
        isLoading={false}
        isError={false}
        onAddTransaction={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });
});