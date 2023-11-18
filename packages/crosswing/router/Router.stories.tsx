import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { useContext } from "react";
import { styled } from "styled-components";
import { colors } from "../theme/colors/colors";
import { fonts } from "../theme/fonts/fonts";
import { CrosswingAppDecorator } from "../theme/storybook";
import { Link } from "./Link";
import { Router } from "./Router";
import { RouterContext } from "./context/RouterContext";
import { NavLayout } from "./navs/NavLayout";
import { NavRoute, Navs } from "./navs/Navs";
import { BrowserSimulator } from "./storybook/BrowserSimulator";
import { Route, Switch } from "./switch/Switch";
import { Tab, Tabs } from "./tabs/Tabs";

export default {
  component: Router,
  decorators: [CrosswingAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Router>;

export const StaticSwitch = () => (
  <StyledBrowserSimulator>
    <Switch>
      <Route
        redirect
        render={() => (
          <div className="content">
            <Link to="/">Default Route</Link>
            <Link to="/bluefish">Static Route</Link>
            <Link to="/redfish">Unknown Route (should not be navigatable)</Link>
          </div>
        )}
      />
      <Route
        path="bluefish"
        render={() => (
          <div className="content">
            <Link to="/">Default Route</Link>
            <Link to="/bluefish">Static Route</Link>
            <Link to="/redfish">Unknown Route (should not be navigatable)</Link>
          </div>
        )}
      />
    </Switch>
  </StyledBrowserSimulator>
);

export const DynamicSwitch = () => (
  <StyledBrowserSimulator>
    <Switch>
      <Route
        render={() => (
          <div className="content">
            <div className="rendering">(Rendering root)</div>
            <Link to="/">Select Nothing</Link>
            <Link to="/nick">Select Nick</Link>
            <Link to="/refer/abc">Select Referral</Link>
            <Link to="/user1">Select User by ID</Link>
          </div>
        )}
      />
      <Route
        path="refer/:code"
        render={({ code }) => (
          <div className="content">
            <div className="rendering">(Rendering refer/:code)</div>
            <Link to="/">Select Nothing</Link>
            <Link to="/nick">Select Nick</Link>
            <Link to="/refer/abc">Select Referral [{code}]</Link>
            <Link to="/user1">Select User by ID</Link>
          </div>
        )}
      />
      <Route
        path=":userId"
        render={({ userId }) => (
          <div className="content">
            <div className="rendering">(Rendering :userId)</div>
            <Link to="/">Select Nothing</Link>
            <Link to="/nick">Select Nick</Link>
            <Link to="/refer/abc">Select Referral</Link>
            <Link to="/user1">Select User by ID [{userId}]</Link>
          </div>
        )}
      />
      <Route
        path="nick"
        render={() => (
          <div className="content">
            <div className="rendering">(Rendering nick)</div>
            <Link to="/">Select Nothing</Link>
            <Link to="/nick">Select Nick</Link>
            <Link to="/refer/abc">Select Referral</Link>
            <Link to="/user1">Select User by ID</Link>
          </div>
        )}
      />
    </Switch>
  </StyledBrowserSimulator>
);

export const App = () => (
  <StyledBrowserSimulator rootPath="app">
    <Switch>
      <Route
        path="outside"
        render={() => (
          <div className="content">
            <h1>Outside the tabs!</h1>
            <Link to="/app/">Back to tabs</Link>
          </div>
        )}
      />
      <Route render={() => <TestAppTabs path="app" />} />
    </Switch>
  </StyledBrowserSimulator>
);

function TestAppTabs({ path }: { path: string }) {
  return (
    <Tabs>
      <Tab
        path="home"
        title="Home"
        render={() => (
          <NavLayout
            isApplicationRoot
            title="Activity"
            left={{
              to: `/${path}/activity/visits/visit1`,
              title: "…",
            }}
            right={{
              title: "Log out",
              onClick: action("Log out"),
            }}
          >
            <div className="content">
              <h1>Home</h1>
              <Link to={`/${path}/outside`}>Go outside the tabs</Link>
            </div>
          </NavLayout>
        )}
      />
      <Tab
        path="activity"
        title="Activity"
        badge={2}
        render={() => (
          <Navs>
            <NavRoute
              render={() => (
                <NavLayout isApplicationRoot title="Activity">
                  <div className="content">
                    <h1>List of Activity</h1>
                    <Link to="visits/visit1">Visit 1</Link>
                  </div>
                </NavLayout>
              )}
            />
            <NavRoute
              path="visits/:visitId"
              render={({ visitId }) => (
                <NavLayout title="Visit" subtitle="Add Trackers to Visit">
                  <div className="content">
                    <h1>
                      Visit Page <b>{visitId || "<missing id>"}</b>
                    </h1>
                    <Link to="comments">Comments</Link>
                    <Link to="?test=true">Add Querystring</Link>
                    <Link to="?">Clear Querystring</Link>
                    <QuerystringView />
                  </div>
                </NavLayout>
              )}
            />
            <NavRoute
              path="visits/:visitId/comments"
              render={({ visitId }) => (
                <NavLayout title="Comments">
                  <div className="content">
                    <h1>Visit Comments</h1>
                    <Link to={`/app/activity/visits/${visitId}?fromComments`}>
                      Back with querystring
                    </Link>
                  </div>
                </NavLayout>
              )}
            />
          </Navs>
        )}
      />
    </Tabs>
  );
}

const StyledBrowserSimulator = styled(BrowserSimulator)`
  .content {
    padding: 10px;
    color: ${colors.text()};
    font: ${fonts.display({ size: 14, line: "20px" })};
    display: flex;
    flex-flow: column;

    > .rendering {
      font-weight: 600;
    }

    > * + * {
      margin-top: 10px;
    }

    a {
      color: inherit;
    }

    a[data-active="true"] {
      text-decoration: none;
    }
  }
`;

function QuerystringView() {
  const { location } = useContext(RouterContext);
  return <div>Querystring: {location.search}</div>;
}
