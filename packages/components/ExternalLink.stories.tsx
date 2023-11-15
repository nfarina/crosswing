import { MockHostProvider } from "@crosswing/host/mocks";
import { colors } from "@crosswing/theme/colors";
import { fonts } from "@crosswing/theme/fonts";
import { CrosswingAppDecorator } from "@crosswing/theme/storybook";
import { action } from "@storybook/addon-actions";
import { styled } from "styled-components";
import { ExternalLink } from "./ExternalLink";

export default {
  component: ExternalLink,
  decorators: [CrosswingAppDecorator()],
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
