import { lazy } from "react";
import { styled } from "styled-components";
import { colors } from "../../../../colors/colors";
import { Redirect } from "../../../../router/redirect/Redirect";
import { Route, Switch } from "../../../../router/switch/Switch";
import { usePageTitle } from "../../../sites/SitePageTitle";
import { StyledToolbar, Toolbar } from "../../../toolbar/Toolbar";
import { ToolbarTab } from "../../../toolbar/ToolbarTab";

const PanelOne = lazy(() => import("../panels/PanelOne"));

// Simulate a slow import.
const PanelTwo = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("../panels/PanelTwo") as any);
    }, 1000);
  });
});

export default function SwitchTab() {
  usePageTitle("Switch"); // For <SuspenseSite> story.

  return (
    <StyledSwitchTab>
      <Toolbar expandTabs>
        <ToolbarTab to="one" children="Panel One" />
        <ToolbarTab to="two" children="Panel Two" />
      </Toolbar>
      <Switch>
        <Route path="one" render={() => <PanelOne />} />
        <Route path="two" render={() => <PanelTwo />} />
        <Route render={() => <Redirect to="one" />} />
      </Switch>
    </StyledSwitchTab>
  );
}

const StyledSwitchTab = styled.div`
  display: flex;
  flex-flow: column;

  > ${StyledToolbar} {
    flex-shrink: 0;
    border-bottom: 1px solid ${colors.separator()};
  }

  > :last-child {
    flex-grow: 1;
  }
`;
