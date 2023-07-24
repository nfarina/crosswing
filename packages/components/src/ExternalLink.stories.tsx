import { MockHostProvider } from "@cyber/host/mocks";
import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import { action } from "@storybook/addon-actions";
import React from "react";
import { styled } from "styled-components";
import { ExternalLink } from "./ExternalLink.js";

export default {
  component: ExternalLink,
  decorators: [CyberAppDecorator()],
  parameters: { layout: "centered" },
};

export const Normal = () => (
  // This is a mock host provider that provides the `openUrl` function.
  <MockHostProvider openUrl={action("openUrl")}>
    <Container>
      This is a link to{" "}
      <ExternalLink href="https://x.com">somewhere else</ExternalLink>.
    </Container>
  </MockHostProvider>
);

const Container = styled.div`
  font: ${fonts.display({ size: 15 })};
  color: ${colors.text()};
`;
