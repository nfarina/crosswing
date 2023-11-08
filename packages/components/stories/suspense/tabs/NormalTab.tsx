import { Route, Switch } from "@cyber/router/switch";
import { lazy } from "react";
import { NoContent } from "../../../NoContent";
import { usePageTitle } from "../../../sites/SitePageTitle";

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
            action="Go to Lazy import  Page"
            actionTo="import"
          />
        )}
      />
      <Route path="import" render={() => <ImportTab />} />
    </Switch>
  );
}
