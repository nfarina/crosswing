import { action } from "@storybook/addon-actions";
import { styled } from "styled-components";
import { MockHostProvider } from "../host/mocks/MockHostProvider";
import { colors } from "../theme/colors/colors";
import { fonts } from "../theme/fonts";
import { CyberAppDecorator } from "../theme/storybook";
import { ExternalLink } from "./ExternalLink";

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
