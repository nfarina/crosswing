import React, { lazy } from "react";
import { SiteArea, SiteLayout, SiteLink } from "../../sites/SiteLayout";
import { NormalTab } from "./tabs/NormalTab";

const SwitchTab = lazy(() => import("./tabs/SwitchTab.js"));
const DataTab = lazy(() => import("./tabs/DataTab.js"));

// A kitchen-sink demo app that tests our router's <Suspense> features and
// how some of our components interact with them.
export const SuspenseSite = () => (
  <SiteLayout title="Cyber Admin">
    <SiteArea path="demos" title="Demos">
      <SiteLink path="normal" title="Normal" render={() => <NormalTab />} />
      <SiteLink path="switch" title="Switch" render={() => <SwitchTab />} />
      <SiteLink path="data" title="Data" render={() => <DataTab />} />
    </SiteArea>
  </SiteLayout>
);
