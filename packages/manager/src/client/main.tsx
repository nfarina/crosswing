import { CyberRootStyle } from "@cyber/theme/containers";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Manager } from "./Manager.js";

const root = createRoot(document.getElementById("cyber-root")!);
root.render(
  <StrictMode>
    <CyberRootStyle />
    <Manager />
  </StrictMode>,
);
