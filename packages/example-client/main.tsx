import { CrosswingRootStyle } from "@crosswing/theme/containers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = createRoot(document.getElementById("crosswing-root")!);
root.render(
  <StrictMode>
    <CrosswingRootStyle />
    <App />
  </StrictMode>,
);
