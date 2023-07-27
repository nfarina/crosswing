import { MobileAppFrame } from "@cyber/components/desktop/MobileAppFrame";
import { MockHostProvider } from "@cyber/host/mocks";
import { ModalRootProvider } from "@cyber/modals/context";
import { AppRouter, BrowserHistory } from "@cyber/router/history";
import { Tab, Tabs } from "@cyber/router/tabs";
import { CyberApp } from "@cyber/theme/app";
import React, { lazy, useState } from "react";

const NavsTab = lazy(() => import("./tabs/NavsTab.js"));
const SwitchTab = lazy(() => import("./tabs/SwitchTab.js"));
const ImportTab = lazy(() => import("./tabs/ImportTab.js"));
const DataTab = lazy(() => import("./tabs/DataTab.js"));

export default function AppContainer() {
  return (
    <MockHostProvider container="ios">
      <CyberApp>
        <ModalRootProvider>
          <MobileAppFrame restorationKey={AppContainer}>
            <App />
          </MobileAppFrame>
        </ModalRootProvider>
      </CyberApp>
    </MockHostProvider>
  );
}

function App() {
  const [history] = useState(() => new BrowserHistory());

  // For testing <Navs> outside <Tabs>.
  if (!window) {
    return <AppRouter history={history} render={() => <NavsTab />} />;
  }

  // For testing <Switch> outside <Tabs>.
  if (!window) {
    return <AppRouter history={history} render={() => <SwitchTab />} />;
  }

  return (
    <AppRouter
      history={history}
      render={() => (
        <Tabs>
          <Tab title="Navs" path="navs" render={() => <NavsTab />} />
          <Tab title="Switch" path="switch" render={() => <SwitchTab />} />
          <Tab title="Import" path="import" render={() => <ImportTab />} />
          <Tab title="Data" path="data" render={() => <DataTab />} />
        </Tabs>
      )}
    />
  );
}
