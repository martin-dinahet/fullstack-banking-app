import { describe, expect, it, vi } from "vitest";
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { LogoutButton } from "./logout-button";

describe("LogoutButton", () => {
  it("renders logout button with text", () => {
    renderWithProviders(<LogoutButton />);
    expect(screen.getByRole("button", { name: /Log out/i })).toBeInTheDocument();
  });
});
