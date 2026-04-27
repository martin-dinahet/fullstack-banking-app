import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { QuickStats } from "../components/quick-stats";
import type { Category } from "@/features/categories/types";

describe("QuickStats", () => {
  const mockCategories: Category[] = [
    { id: 1, title: "Food", operationCount: 5 },
    { id: 2, title: "Transport", operationCount: 3 },
  ];

  it("displays total transaction count from categories", () => {
    renderWithProviders(<QuickStats categories={mockCategories} onAddTransaction={vi.fn()} />);
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Total Transactions")).toBeInTheDocument();
  });

  it("shows zero when no categories", () => {
    renderWithProviders(<QuickStats categories={[]} onAddTransaction={vi.fn()} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("calls onAddTransaction when button is clicked", async () => {
    const onAddTransaction = vi.fn();
    renderWithProviders(<QuickStats categories={mockCategories} onAddTransaction={onAddTransaction} />);

    await userEvent.click(screen.getByRole("button", { name: /add transaction/i }));
    expect(onAddTransaction).toHaveBeenCalledOnce();
  });
});
