import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconArrowDown, IconArrowUp, IconX, IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createOperation } from "@/features/operations/api/operations.api";
import { createCategory } from "@/features/categories/api/categories.api";
import type { Category } from "@/features/categories/types";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  categories,
}: AddTransactionDialogProps) {
  const queryClient = useQueryClient();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [formData, setFormData] = useState({
    label: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category_ids: [] as number[],
    newCategory: "",
  });
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setFormData((prev) => ({
        ...prev,
        category_ids: [...prev.category_ids, newCategory.id],
        newCategory: "",
      }));
      setShowNewCategory(false);
      toast.success(`Category "${newCategory.title}" created`);
    },
  });

  const operationMutation = useMutation({
    mutationFn: createOperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Transaction added successfully");
      handleClose();
    },
    onError: () => {
      toast.error("Failed to add transaction");
    },
  });

  const handleClose = () => {
    setFormData({
      label: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category_ids: [],
      newCategory: "",
    });
    setShowNewCategory(false);
    setSearchQuery("");
    setType("expense");
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!formData.label.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (formData.category_ids.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    operationMutation.mutate({
      label: formData.label.trim(),
      amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount),
      date: formData.date,
      category_ids: formData.category_ids,
    });
  };

  const toggleCategory = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter((id) => id !== categoryId)
        : [...prev.category_ids, categoryId],
    }));
  };

  const selectedCategories = categories.filter((c) => formData.category_ids.includes(c.id));
  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCategory = () => {
    const title = formData.newCategory.trim();
    if (!title) return;
    createCategoryMutation.mutate({ title });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a new income or expense transaction.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field>
            <FieldLabel>Type</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                  type === "expense"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-background text-muted-foreground hover:border-border/80"
                }`}
              >
                <IconArrowDown className="h-4 w-4" />
                <span className="text-sm font-medium">Expense</span>
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                  type === "income"
                    ? "border-green-600 bg-green-600/10 text-green-600 dark:border-green-500 dark:bg-green-500/10 dark:text-green-500"
                    : "border-border bg-background text-muted-foreground hover:border-border/80"
                }`}
              >
                <IconArrowUp className="h-4 w-4" />
                <span className="text-sm font-medium">Income</span>
              </button>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="label">Description</FieldLabel>
            <Input
              id="label"
              placeholder="e.g., Grocery shopping"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-7"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="date">Date</FieldLabel>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel>Categories</FieldLabel>

            {selectedCategories.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {cat.title}
                    <IconX className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}

            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={selectedCategories.length > 0 ? "mt-2" : ""}
            />

            <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
              {filteredCategories
                .filter((c) => !formData.category_ids.includes(c.id))
                .slice(0, 10)
                .map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="rounded-full border border-input bg-background px-3 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    + {category.title}
                  </button>
                ))}
            </div>

            {searchQuery &&
              !categories.some(
                (c) => c.title.toLowerCase() === searchQuery.toLowerCase()
              ) && !showNewCategory && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full justify-start"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, newCategory: searchQuery }));
                    setShowNewCategory(true);
                  }}
                >
                  <IconPlus className="h-4 w-4" />
                  Create "{searchQuery}"
                </Button>
              )}

            {showNewCategory && (
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="New category name"
                  value={formData.newCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, newCategory: e.target.value })
                  }
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateCategory}
                  disabled={
                    !formData.newCategory.trim() || createCategoryMutation.isPending
                  }
                >
                  {createCategoryMutation.isPending ? <Spinner className="h-4 w-4" /> : "Add"}
                </Button>
              </div>
            )}
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                operationMutation.isPending || createCategoryMutation.isPending
              }
            >
              {(operationMutation.isPending ||
                createCategoryMutation.isPending) && (
                <Spinner data-icon="inline-start" />
              )}
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}