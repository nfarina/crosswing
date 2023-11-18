import { CrosswingRootStyle } from "crosswing/theme/containers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Manager } from "./Manager";

const root = createRoot(document.getElementById("crosswing-root")!);
root.render(
  <StrictMode>
    <CrosswingRootStyle />
    <Manager />
  </StrictMode>,
);
