import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { queryClient } from "@/lib/query-client";
import { AppLayout } from "./components/app-layout";
import { IndexPage } from "./pages/index-page";
import { LoginPage } from "./pages/login-page";
import { SignUpPage } from "./pages/sign-up-page";
import "@/globals.css";

// biome-ignore lint/style/noNonNullAssertion: <>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/sign-in" element={<LoginPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route element={<AppLayout />}>
                  <Route path="/" element={<IndexPage />} />
                </Route>
              </Routes>
              <Toaster />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
