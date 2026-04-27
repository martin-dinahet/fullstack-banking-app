import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { TransactionList } from "../components/transaction-list";
import type { CreateOperationResponse } from "@/features/operations/api/operations.api";

describe("TransactionList", () => {
  const mockTransactions: CreateOperationResponse[] = [
    {
      id: 1,
      label: "Salary",
      amount: 5000,
      date: "2024-06-15",
      categories: [{ id: 1, title: "Income" }],
    },
    {
      id: 2,
      label: "Groceries",
      amount: -150,
      date: "2024-06-14",
      categories: [{ id: 2, title: "Food" }],
    },
    {
      id: 3,
      label: "Rent",
      amount: -1200,
      date: "2024-06-01",
      categories: [{ id: 3, title: "Housing" }],
    },
  ];

  it("shows loading state with skeleton placeholders", () => {
    renderWithProviders(<TransactionList transactions={[]} isLoading={true} />);
    const skeletons = document.body.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows empty state when no transactions", () => {
    renderWithProviders(<TransactionList transactions={[]} isLoading={false} />);
    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
  });

  it("displays transactions correctly", () => {
    renderWithProviders(<TransactionList transactions={mockTransactions} isLoading={false} />);
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
  });

  it("shows category badges", () => {
    renderWithProviders(<TransactionList transactions={mockTransactions} isLoading={false} />);
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Housing")).toBeInTheDocument();
  });

  it("shows positive amounts with green styling", () => {
    renderWithProviders(<TransactionList transactions={mockTransactions} isLoading={false} />);
    const greenElement = document.body.querySelector(".text-green-600");
    expect(greenElement).toBeInTheDocument();
  });

  it("shows negative amounts with destructive styling", () => {
    renderWithProviders(<TransactionList transactions={mockTransactions} isLoading={false} />);
    const expenseElements = document.body.querySelectorAll(".text-destructive");
    expect(expenseElements.length).toBeGreaterThan(0);
  });
});
