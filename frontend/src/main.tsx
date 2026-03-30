import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { IndexPage } from "./pages/index-page";

// biome-ignore lint/style/noNonNullAssertion: <>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IndexPage />
  </StrictMode>,
);
