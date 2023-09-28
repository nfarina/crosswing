import { HTMLAttributes } from "react";
import { styled } from "styled-components";
import { useHost } from "../host/context/HostContext";

export function BottomScrollable({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { container } = useHost();

  return (
    <StyledBottomScrollable {...rest}>
      {container === "ios" && <div className="bouncer" />}
      <div className="spacer" />
      {children}
    </StyledBottomScrollable>
  );
}

export const StyledBottomScrollable = styled.div`
  overflow: auto;
  position: relative;
  display: flex;

  /* Incredibly magical trick that naturally keeps our content scrolled to the bottom. */
  /* https://stackoverflow.com/a/44051405/66673 */
  flex-flow: column-reverse;

  > * {
    flex-shrink: 0;
  }

  /**
   * Helpful trick that uses any remaining space after layout to push children
   * to the top such that content flows top to bottom until it overflows the
   * container, then remains fixed to the bottom.
   */
  > .spacer {
    flex-grow: 1;
    position: relative;
  }

  /*
   * We use our <div> element to force the scroll view to become scrollable
   * when the content is small enough that it wouldn't scroll on its own. We
   * make ourself one pixel larger than our parent div.
   */
  > .bouncer {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 1px;
    pointer-events: none;
    height: calc(100% + 1px);
  }
`;
