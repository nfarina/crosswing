import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import React, { useState } from "react";
import { styled } from "styled-components";
import { AppRouter } from "../history/AppRouter.js";
import { MemoryHistory } from "../history/MemoryHistory.js";
import { Tab, Tabs } from "./Tabs.js";

export default {
  component: Tabs,
  decorators: [CyberAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
};

export const Normal = () => {
  const [history] = useState(() => new MemoryHistory());

  return (
    <AppRouter
      history={history}
      render={() => (
        <Tabs>
          <Tab
            path="home"
            title="Home"
            render={() => <SamplePage>Favorite Cupcakes</SamplePage>}
          />
          <Tab
            path="activity"
            title="Activity"
            render={() => <SamplePage>List of Cupcake Tastings</SamplePage>}
          />
          <Tab
            path="account"
            title="Account"
            render={() => <SamplePage>Cupcake Account</SamplePage>}
          />
        </Tabs>
      )}
    />
  );
};

const SamplePage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font: ${fonts.display({ size: 14 })};
  color: ${colors.text()};
`;
