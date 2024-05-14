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
    <FullScreenView restorationKey={Default} title="Default">
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
    >
      <Content />
    </FullScreenView>
  </Container>
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
