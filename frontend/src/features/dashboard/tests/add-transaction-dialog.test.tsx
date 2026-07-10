import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Category } from "@/features/categories/types";
import type { CreateOperationResponse } from "@/features/operations/api/operations.api";
import { renderWithProviders } from "@/test/test-utils";
import { AddTransactionDialog } from "../components/add-transaction-dialog";

describe("AddTransactionDialog", () => {
  const mockCategories: Category[] = [
    { id: 1, title: "Food", operationCount: 5 },
    { id: 2, title: "Transport", operationCount: 3 },
  ];

  const mockTransaction: CreateOperationResponse = {
    id: 1,
    label: "Grocery shopping",
    amount: -42.5,
    date: "2026-07-10",
    categories: [{ id: 1, title: "Food" }],
  };

  it("renders when open", () => {
    renderWithProviders(<AddTransactionDialog open={true} onOpenChange={vi.fn()} categories={mockCategories} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderWithProviders(<AddTransactionDialog open={false} onOpenChange={vi.fn()} categories={mockCategories} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows expense type selected by default", () => {
    renderWithProviders(<AddTransactionDialog open={true} onOpenChange={vi.fn()} categories={mockCategories} />);
    expect(screen.getByText("Expense")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
  });

  it("calls onOpenChange with false when cancel is clicked", async () => {
    const onOpenChange = vi.fn();
    renderWithProviders(<AddTransactionDialog open={true} onOpenChange={onOpenChange} categories={mockCategories} />);

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has category search field", () => {
    renderWithProviders(<AddTransactionDialog open={true} onOpenChange={vi.fn()} categories={mockCategories} />);
    expect(screen.getByPlaceholderText(/search categories/i)).toBeInTheDocument();
  });

  it("prefills fields when editing a transaction", () => {
    renderWithProviders(
      <AddTransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        categories={mockCategories}
        transaction={mockTransaction}
      />,
    );

    expect(screen.getByRole("dialog", { name: /edit transaction/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toHaveValue("Grocery shopping");
    expect(screen.getByLabelText("Amount")).toHaveValue(42.5);
    expect(screen.getByLabelText("Date")).toHaveValue("2026-07-10");
    expect(screen.getByRole("button", { name: /food/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});
