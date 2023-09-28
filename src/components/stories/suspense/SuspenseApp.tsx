import { lazy } from "react";
import { Tab, Tabs } from "../../../router/tabs/Tabs";

const NavsTab = lazy(() => import("./tabs/NavsTab.js"));
const SwitchTab = lazy(() => import("./tabs/SwitchTab.js"));
const ImportTab = lazy(() => import("./tabs/ImportTab.js"));
const DataTab = lazy(() => import("./tabs/DataTab.js"));

// A kitchen-sink demo app that tests our router's <Suspense> features and
// how some of our components interact with them.
export const SuspenseApp = () => (
  <Tabs>
    <Tab title="Navs" path="navs" render={() => <NavsTab />} />
    <Tab title="Switch" path="switch" render={() => <SwitchTab />} />
    <Tab title="Import" path="import" render={() => <ImportTab />} />
    <Tab title="Data" path="data" render={() => <DataTab />} />
  </Tabs>
);

export const SuspenseNavs = () => <NavsTab />;

export const SuspenseSwitch = () => <SwitchTab />;
