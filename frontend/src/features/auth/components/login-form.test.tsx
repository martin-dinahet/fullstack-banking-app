import { describe, expect, it, vi } from "vitest";
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("renders email and password inputs", () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders description text", () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByText(/Enter your email and password/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
  });

  it("has a link to sign up page", () => {
    renderWithProviders(<LoginForm />);
    const signUpLink = screen.getByRole("link", { name: /Create an account/i });
    expect(signUpLink).toHaveAttribute("href", "/sign-up");
  });
});
