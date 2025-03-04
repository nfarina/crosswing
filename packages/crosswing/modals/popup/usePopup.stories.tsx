import { useRef, useState } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { CrosswingAppDecorator } from "../../storybook.js";
import { ModalRootProvider } from "../context/ModalRootProvider.js";
import { ModalStoryButton } from "../storybook/ModalStoryButtons.js";
import { ModalDecorator } from "../storybook/decorators.js";
import { PopupView } from "./PopupView.js";
import { usePopup } from "./usePopup.js";

export default {
  component: usePopup,
  decorators: [CrosswingAppDecorator({ layout: "fullscreen" }), ModalDecorator],
  parameters: { layout: "fullscreen" },
};

export function Normal() {
  const basicPopup = (
    <PopupView>
      <ResizableContent />
    </PopupView>
  );

  const popup1 = usePopup(() => basicPopup, { placement: "below" });
  const popup2 = usePopup(() => basicPopup, { placement: "platform" });
  const popup3 = usePopup(() => basicPopup, { placement: "platform" });
  const popup4 = usePopup(() => basicPopup, { placement: "above" });
  const popup5 = usePopup(() => basicPopup);

  return (
    <FourCorners>
      <ModalStoryButton onClick={popup1.onClick}>Popup Below</ModalStoryButton>
      <ModalStoryButton onClick={popup2.onClick}>
        Popup Platform
      </ModalStoryButton>
      <ModalStoryButton onClick={popup3.onClick}>
        Popup Platform
      </ModalStoryButton>
      <ModalStoryButton onClick={popup4.onClick}>Popup Above</ModalStoryButton>
      <ModalStoryButton onClick={popup5.onClick}>Popup Below</ModalStoryButton>
    </FourCorners>
  );
}

export function ManualControl() {
  const popup = usePopup(
    () => (
      <PopupView>
        <PopupMountCounter />
      </PopupView>
    ),
    {
      clickOutsideToClose: false,
    },
  );
  const ref1 = useRef<HTMLDivElement | null>(null);
  const ref2 = useRef<HTMLDivElement | null>(null);

  return (
    <ManualControlView>
      <ModalStoryButton onClick={() => popup.show(ref1)}>
        Show on Target 1
      </ModalStoryButton>
      <ModalStoryButton
        onClick={() => {
          ref1.current?.style.setProperty(
            "transform",
            `translateY(${Math.random() * 100}px)`,
          );
          popup.show(ref1);
        }}
      >
        Move Target 1 (calls show())
      </ModalStoryButton>
      <ModalStoryButton onClick={() => popup.show(ref2)}>
        Show on Target 2
      </ModalStoryButton>
      <ModalStoryButton
        onClick={() => {
          ref2.current?.style.setProperty(
            "transform",
            `translateY(${Math.random() * 100}px)`,
          );
        }}
      >
        Move Target 2 (auto reposition)
      </ModalStoryButton>
      <ModalStoryButton onClick={popup.hide}>Hide Popup</ModalStoryButton>
      <div className="targets">
        <div ref={ref1}>Target 1</div>
        <div ref={ref2}>Target 2</div>
      </div>
    </ManualControlView>
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

const ManualControlView = styled.div`
  display: flex;
  flex-flow: column;

  > * {
    margin: 10px;
  }

  > .targets {
    display: flex;
    flex-flow: row;

    > div {
      flex-grow: 1;
      padding: 10px;
      border: 1px dashed ${colors.separator()};
      border-radius: 6px;
      color: ${colors.text()};
      font: ${fonts.display({ size: 14 })};
      text-align: center;
    }

    > div + div {
      margin-left: 10px;
    }
  }
`;

let mountCounter = 0;
const getNextMountCounter = () => ++mountCounter;

function PopupMountCounter() {
  const [mountTime] = useState(getNextMountCounter);

  return <StyledPopupMountCounter>Mount #{mountTime}</StyledPopupMountCounter>;
}

const StyledPopupMountCounter = styled.div`
  padding: 10px;
  font: ${fonts.display({ size: 14 })};
  color: ${colors.text()};
`;
