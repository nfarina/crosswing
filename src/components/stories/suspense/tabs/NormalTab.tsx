import React, { lazy } from "react";
import { Route, Switch } from "../../../../router/switch/Switch.js";
import { NoContent } from "../../../NoContent.js";
import { usePageTitle } from "../../../sites/SitePageTitle.js";

const ImportTab = lazy(() => import("./ImportTab.js"));

export function NormalTab() {
  usePageTitle("Normal"); // For <SuspenseSite> story.

  return (
    <Switch>
      <Route
        render={() => (
          <NoContent
            title="Normal Link"
            subtitle="No Suspense"
            action="Go to Lazy Import Page"
            actionTo="import"
          />
        )}
      />
      <Route path="import" render={() => <ImportTab />} />
    </Switch>
  );
}
