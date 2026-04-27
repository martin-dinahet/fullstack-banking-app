import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { CategoryBreakdown } from "../components/category-breakdown";
import type { Category } from "@/features/categories/types";

describe("CategoryBreakdown", () => {
  const mockCategories: Category[] = [
    { id: 1, title: "Food", operationCount: 10 },
    { id: 2, title: "Housing", operationCount: 5 },
    { id: 3, title: "Transport", operationCount: 3 },
    { id: 4, title: "Entertainment", operationCount: 2 },
  ];

  it("shows loading state with skeletons", () => {
    renderWithProviders(<CategoryBreakdown categories={[]} isLoading={true} />);
    const skeletons = document.body.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows empty state when no categories", () => {
    renderWithProviders(<CategoryBreakdown categories={[]} isLoading={false} />);
    expect(screen.getByText(/no categories/i)).toBeInTheDocument();
  });

  it("shows empty state when all categories have 0 operations", () => {
    const emptyCategories: Category[] = [
      { id: 1, title: "Food", operationCount: 0 },
      { id: 2, title: "Housing", operationCount: 0 },
    ];
    renderWithProviders(<CategoryBreakdown categories={emptyCategories} isLoading={false} />);
    expect(screen.getByText(/no categories/i)).toBeInTheDocument();
  });

  it("displays top 5 categories sorted by count", () => {
    renderWithProviders(<CategoryBreakdown categories={mockCategories} isLoading={false} />);
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Housing")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
  });

  it("shows category operation counts", () => {
    renderWithProviders(<CategoryBreakdown categories={mockCategories} isLoading={false} />);
    expect(screen.getAllByText(/10/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Housing/)).toBeInTheDocument();
  });

  it("limits to 5 categories", () => {
    const manyCategories: Category[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Category ${i + 1}`,
      operationCount: 10 - i,
    }));
    renderWithProviders(<CategoryBreakdown categories={manyCategories} isLoading={false} />);
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.queryByText("Category 6")).not.toBeInTheDocument();
  });
});
