import React, { lazy } from "react";
import { SiteLayout } from "../../sites/SiteLayout.js";

const NavsTab = lazy(() => import("./tabs/NavsTab.js"));
const SwitchTab = lazy(() => import("./tabs/SwitchTab.js"));
const ImportTab = lazy(() => import("./tabs/ImportTab.js"));
const DataTab = lazy(() => import("./tabs/DataTab.js"));

// A kitchen-sink demo app that tests our router's <Suspense> features and
// how some of our components interact with them.
export const SuspenseSite = () => <SiteLayout title="Cyber Admin" />;
