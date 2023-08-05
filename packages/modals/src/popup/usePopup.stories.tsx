import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import { CyberAppDecorator } from "@cyber/theme/storybook";
import React, { useState } from "react";
import { styled } from "styled-components";
import { ModalRootProvider } from "../context/ModalRootProvider.js";
import { Button } from "../storybook/Button.js";
import { ModalDecorator } from "../storybook/ModalDecorator.js";
import { PopupView } from "./PopupView.js";
import { usePopup } from "./usePopup.js";

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
      <Button onClick={popup1.onClick}>Show Popup</Button>
      <Button onClick={popup2.onClick}>Show Popup</Button>
      <Button onClick={popup3.onClick}>Show Popup</Button>
      <Button onClick={popup4.onClick}>Show Popup</Button>
      <Button onClick={popup5.onClick}>Show Popup</Button>
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
