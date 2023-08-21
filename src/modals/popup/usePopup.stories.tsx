import React, { useState } from "react";
import { styled } from "styled-components";
import { colors } from "../../theme/colors/colors";
import { fonts } from "../../theme/fonts";
import { CyberAppDecorator } from "../../theme/storybook";
import { ModalRootProvider } from "../context/ModalRootProvider";
import { ModalDecorator } from "../storybook/ModalDecorator";
import { ModalStoryButton } from "../storybook/ModalStoryButtons";
import { PopupView } from "./PopupView";
import { usePopup } from "./usePopup";

export default {
  component: usePopup,
  decorators: [CyberAppDecorator({ layout: "fullscreen" }), ModalDecorator],
  parameters: { layout: "fullscreen" },
};

export function Normal() {
  const basicPopup = (
    <PopupView>
      <ResizableContent />
    </PopupView>
  );

  const popup1 = usePopup(() => basicPopup);
  const popup2 = usePopup(() => basicPopup);
  const popup3 = usePopup(() => basicPopup, { placement: "above" });
  const popup4 = usePopup(() => basicPopup, { placement: "above" });
  const popup5 = usePopup(() => basicPopup);

  return (
    <FourCorners>
      <ModalStoryButton onClick={popup1.onClick}>Show Popup</ModalStoryButton>
      <ModalStoryButton onClick={popup2.onClick}>Show Popup</ModalStoryButton>
      <ModalStoryButton onClick={popup3.onClick}>Show Popup</ModalStoryButton>
      <ModalStoryButton onClick={popup4.onClick}>Show Popup</ModalStoryButton>
      <ModalStoryButton onClick={popup5.onClick}>Show Popup</ModalStoryButton>
    </FourCorners>
  );
}

/**
 * Ensures that the popup math works even for modal containers that don't
 * match the window coordinate system.
 */
export function Inset() {
  return (
    <InsetForModal>
      <ModalRootProvider>
        <Normal />
      </ModalRootProvider>
    </InsetForModal>
  );
}

function ResizableContent() {
  const [larger, setLarger] = useState(false);

  return (
    <BasicContent onClick={() => setLarger((l) => !l)}>
      {larger
        ? "Reprehenderit irure adipisicing ullamco reprehenderit anim nulla."
        : "Click to make this larger."}
    </BasicContent>
  );
}

const BasicContent = styled.div`
  padding: 10px;
  font: ${fonts.display({ size: 14 })};
  color: ${colors.text()};
`;

const FourCorners = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  > *:nth-child(1) {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  > *:nth-child(2) {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  > *:nth-child(3) {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  > *:nth-child(4) {
    position: absolute;
    left: 10px;
    bottom: 10px;
  }

  > *:nth-child(5) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const InsetForModal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;

  > * {
    margin: 10px;
    box-sizing: border-box;
    border: 2px solid ${colors.separator()};
    height: 0;
    flex-grow: 1;
  }
`;
