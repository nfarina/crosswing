import { CyberRootStyle } from "@cyber/theme/containers";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppContainer from "./App.js";

const root = createRoot(document.getElementById("cyber-root")!);
root.render(
  <StrictMode>
    <CyberRootStyle />
    <AppContainer />
  </StrictMode>,
);
