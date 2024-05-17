import styled from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import { ModalDecorator } from "../../modals/storybook/ModalDecorator";
import { RouterDecorator } from "../../router/storybook/RouterDecorator";
import { CrosswingAppDecorator } from "../../storybook";
import { FullScreenView, useFullScreen } from "./FullScreenView";

export default {
  component: FullScreenView,
  decorators: [
    CrosswingAppDecorator({ layout: "fullscreen" }),
    ModalDecorator,
    RouterDecorator, // Has <Suspense> to test lazy().
  ],
  parameters: { layout: "fullscreen" },
};

export const Default = () => (
  <Container>
    <FullScreenView restorationKey={Default} title="Default" threshold={1}>
      <Content />
    </FullScreenView>
  </Container>
);

export const DefaultFullScreen = () => (
  <Container>
    <FullScreenView
      restorationKey={DefaultFullScreen}
      title="Default"
      defaultFullScreen
      threshold={1}
    >
      <Content />
    </FullScreenView>
  </Container>
);

export const SmallerThanThreshold = () => (
  <ResponsiveContainer>
    <FullScreenView
      restorationKey={SmallerThanThreshold}
      title="Smaller than threshold"
      style={{ width: "80%", height: "80%" }}
    >
      <Content />
    </FullScreenView>
  </ResponsiveContainer>
);

export const LargerThanThreshold = () => (
  <ResponsiveContainer>
    <FullScreenView
      restorationKey={LargerThanThreshold}
      title="Larger than threshold"
      style={{ width: "81%", height: "81%" }}
    >
      <Content />
    </FullScreenView>
  </ResponsiveContainer>
);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    width: 400px;
    height: 400px;
  }
`;

const ResponsiveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Content() {
  const { isFullScreen } = useFullScreen();

  return (
    <StyledContent>
      {isFullScreen ? "Full Screen" : "Not Full Screen"}
    </StyledContent>
  );
}

const StyledContent = styled.div`
  display: flex;
  background: ${colors.darkGray()};
  color: ${colors.white()};
  font: ${fonts.display({ size: 18 })};
  justify-content: center;
  align-items: center;
`;
