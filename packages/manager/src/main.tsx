import React from "react";
import { createRoot } from "react-dom/client";
import { Manager } from "./Manager.js";

const root = createRoot(document.getElementById("root")!);
root.render(<Manager />);
