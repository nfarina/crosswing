import { flattenChildren } from "@crosswing/hooks/flattenChildren";
import { Redirect } from "@crosswing/router/redirect";
import { Route, Switch } from "@crosswing/router/switch";
import { ReactElement, ReactNode, isValidElement } from "react";
import { NoContent } from "../NoContent";
import {
  Toolbar,
  ToolbarInsertionPoint,
  ToolbarSpace,
} from "../toolbar/Toolbar";
import { ToolbarLayout } from "../toolbar/ToolbarLayout";
import { ToolbarTab } from "../toolbar/ToolbarTab";
import { usePageTitle } from "./SitePageTitle";

export interface SiteTabProps {
  path: string;
  title: ReactNode;
  default?: boolean;
  render: () => ReactElement<any>;
}

export function SiteTabs({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  usePageTitle(title, { intermediate: true });

  // Coerce children to array, flattening fragments and falsy conditionals.
  const tabs = flattenChildren(children).filter(isSiteTab);

  const defaultTab = tabs.find((tab) => tab.props.default);

  return (
    <ToolbarLayout neverHides>
      <Toolbar>
        {tabs.map((tab) => (
          <ToolbarTab
            key={tab.props.path}
            to={tab.props.path}
            children={tab.props.title}
          />
        ))}
        {/* In case any children want to insert additional toolbar items, they should be on the right away from the tabs. */}
        <ToolbarSpace />
        <ToolbarInsertionPoint name="CloseButton" />
      </Toolbar>
      <Switch>
        {tabs.map((tab) => (
          <Route
            key={tab.props.path}
            path={tab.props.path}
            render={tab.props.render}
          />
        ))}
        <Route
          render={() =>
            defaultTab ? (
              <Redirect to={defaultTab.props.path} />
            ) : (
              <NoContent title="Nothing Selected" />
            )
          }
        />
      </Switch>
    </ToolbarLayout>
  );
}

export function SiteTab({}: SiteTabProps) {
  // Our own render method is never called.
  return null;
}
// We use this instead of comparing item.type === SiteTab because that class
// pointer is not stable during development with hot reloading.
SiteTab.isSiteTab = true;

function isSiteTab(child: ReactNode): child is ReactElement<SiteTabProps> {
  return isValidElement(child) && !!child.type?.["isSiteTab"];
}
