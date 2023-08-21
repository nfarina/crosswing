import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CyberRootStyle } from "../../theme/containers";
import { Manager } from "./Manager";

const root = createRoot(document.getElementById("cyber-root")!);
root.render(
  <StrictMode>
    <CyberRootStyle />
    <Manager />
  </StrictMode>,
);
