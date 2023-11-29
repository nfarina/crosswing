import { CrosswingRootStyle } from "crosswing/containers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Manager } from "./Manager.js";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <CrosswingRootStyle />
    <Manager />
  </StrictMode>,
);
