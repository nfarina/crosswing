import { MobileAppFrame } from "@cyber/components/desktop/MobileAppFrame";
import { ModalRootProvider } from "@cyber/modals/context";
import { AppRouter, BrowserHistory } from "@cyber/router/history";
import { Tab, Tabs } from "@cyber/router/tabs";
import { CyberApp } from "@cyber/theme/app";
import React, { lazy, useState } from "react";

const TabOne = lazy(() => import("./TabOne.js"));
const TabTwo = lazy(() => import("./TabTwo.js"));

export default function AppContainer() {
  return (
    <CyberApp>
      <ModalRootProvider>
        <MobileAppFrame restorationKey={AppContainer}>
          <App />
        </MobileAppFrame>
      </ModalRootProvider>
    </CyberApp>
  );
}

function App() {
  const [history] = useState(() => new BrowserHistory());

  return (
    <AppRouter
      history={history}
      render={() => (
        <Tabs>
          <Tab title="One" path="one" render={() => <TabOne />} />
          <Tab title="Two" path="two" render={() => <TabTwo />} />
        </Tabs>
      )}
    />
  );
}
