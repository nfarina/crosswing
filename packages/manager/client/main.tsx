import { CyberRootStyle } from "@cyber/theme/containers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Manager } from "./Manager";

const root = createRoot(document.getElementById("cyber-root")!);
root.render(
  <StrictMode>
    <CyberRootStyle />
    <Manager />
  </StrictMode>,
);
