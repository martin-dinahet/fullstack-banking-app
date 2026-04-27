import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { BalanceSummaryCard } from "../components/balance-summary-card";

describe("BalanceSummaryCard", () => {
  const mockSummary = {
    total_income: 5000,
    total_expense: -2500,
    balance: 2500,
    count: 15,
  };

  it("shows loading state", () => {
    renderWithProviders(<BalanceSummaryCard summary={undefined} isLoading={true} />);
    expect(document.body).toHaveTextContent("Net Balance");
  });

  it("shows zero balance when no summary", () => {
    renderWithProviders(<BalanceSummaryCard summary={undefined} isLoading={false} />);
    expect(document.body).toHaveTextContent("$0.00");
  });

  it("displays balance and income/expense correctly", () => {
    renderWithProviders(<BalanceSummaryCard summary={mockSummary} isLoading={false} />);
    expect(document.body).toHaveTextContent("$2,500.00");
    expect(document.body).toHaveTextContent("Net Balance");
    expect(document.body).toHaveTextContent("Income");
    expect(document.body).toHaveTextContent("Expenses");
  });

  it("shows income with positive styling", () => {
    renderWithProviders(<BalanceSummaryCard summary={mockSummary} isLoading={false} />);
    const incomeElement = document.body.querySelector(".text-green-600");
    expect(incomeElement).toBeInTheDocument();
  });

  it("shows expenses with destructive color", () => {
    renderWithProviders(<BalanceSummaryCard summary={mockSummary} isLoading={false} />);
    const expenseElement = document.body.querySelector(".text-destructive");
    expect(expenseElement).toBeInTheDocument();
  });

  it("displays balance with primary color when positive", () => {
    renderWithProviders(<BalanceSummaryCard summary={mockSummary} isLoading={false} />);
    const balanceElement = document.body.querySelector(".text-primary");
    expect(balanceElement).toBeInTheDocument();
  });
});