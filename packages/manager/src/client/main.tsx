import React from "react";
import { createRoot } from "react-dom/client";
import { ManagerContainer } from "./Manager.js";

const root = createRoot(document.getElementById("cyber-root")!);
root.render(<ManagerContainer />);
