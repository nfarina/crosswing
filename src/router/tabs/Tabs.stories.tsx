import { useState } from "react";
import { styled } from "styled-components";
import { colors } from "../../theme/colors/colors";
import { fonts } from "../../theme/fonts";
import { CyberAppDecorator } from "../../theme/storybook";
import { Router } from "../Router";
import { MemoryHistory } from "../history/MemoryHistory";
import { Tab, Tabs } from "./Tabs";

export default {
  component: Tabs,
  decorators: [CyberAppDecorator({ layout: "mobile" })],
  parameters: { layout: "centered" },
};

export const Normal = () => {
  const [history] = useState(() => new MemoryHistory());

  return (
    <Router
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
