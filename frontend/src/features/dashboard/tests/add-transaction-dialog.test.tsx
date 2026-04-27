import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Category } from "@/features/categories/types";
import { renderWithProviders } from "@/test/test-utils";
import { AddTransactionDialog } from "../components/add-transaction-dialog";

describe("AddTransactionDialog", () => {
  const mockCategories: Category[] = [
    { id: 1, title: "Food", operationCount: 5 },
    { id: 2, title: "Transport", operationCount: 3 },
  ];

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
});
