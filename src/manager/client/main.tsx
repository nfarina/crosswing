import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CyberRootStyle } from "../../theme/containers.js";
import { Manager } from "./Manager.js";

const root = createRoot(document.getElementById("cyber-root")!);
root.render(
  <StrictMode>
    <CyberRootStyle />
    <Manager />
  </StrictMode>,
);
