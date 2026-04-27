import { describe, expect, it, vi } from "vitest";
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SignUpForm } from "./sign-up-form";

describe("SignUpForm", () => {
  it("renders email, password and confirm password fields", () => {
    renderWithProviders(<SignUpForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  it("renders description text", () => {
    renderWithProviders(<SignUpForm />);
    expect(screen.getByText(/Create an account to get started/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    renderWithProviders(<SignUpForm />);
    expect(screen.getByRole("button", { name: /Sign up/i })).toBeInTheDocument();
  });

  it("has a link to sign in page", () => {
    renderWithProviders(<SignUpForm />);
    const signInLink = screen.getByRole("link", { name: /Sign in instead/i });
    expect(signInLink).toHaveAttribute("href", "/sign-in");
  });
});
