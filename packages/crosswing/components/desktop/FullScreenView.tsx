import {
  createContext,
  HTMLAttributes,
  ReactNode,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { useElementSize } from "../../hooks/useElementSize.js";
import { useHotkey } from "../../hooks/useHotkey.js";
import { useSessionStorage } from "../../hooks/useSessionStorage.js";
import Close from "../../icons/Close.svg?react";
import FullScreen from "../../icons/FullScreen.svg?react";
import { ModalContext } from "../../modals/context/ModalContext.js";
import { Button, StyledButton } from "../Button.js";
import { ToolbarSpace } from "../toolbar/Toolbar.js";

export function FullScreenView({
  restorationKey,
  title,
  hotkey = "cmd+shift+f",
  children,
  defaultFullScreen = false,
  threshold = 0.8,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  /**
   * Prevents separate fullscreen views from colliding with each other in terms
   * of user preference for on/off. This could be a string but then it's easy to
   * forget to change the string when copy/pasting code, so it's a function
   * instead, typically your component function, which we'll access the `name`
   * property of.
   */
  restorationKey: Function;
  title: ReactNode;
  hotkey?: string;
  defaultFullScreen?: boolean;
  /**
   * How much smaller does the FullScreenView need to be relative to the
   * viewport before it renders the full screen button? Default is 80%.
   * This ensures that the buttons only appear when they're needed.
   */
  threshold?: number;
}) {
  // Fit our "full screen" rect to the nearest modal provider boundary.
  const { modalRoot } = useContext(ModalContext);

  const [forceRefresh, setForceRefresh] = useState(0);

  // This is our "natural" parent.
  const parentRef = useRef<HTMLDivElement | null>(null);

  // This is what React will render us into.
  const divRef = useRef<HTMLDivElement | null>(null);

  // Persist the fullscreen status across window reloads (don't use
  // localStorage because then other unrelated tabs would be affected).
  let [isFullScreen, setFullScreen] = useSessionStorage(
    `FullScreenView:${restorationKey.name}:isFullScreen`,
    defaultFullScreen,
  );

  const [disabled, setDisabled] = useState(false);
  if (disabled) isFullScreen = false;

  // The blue full screen buttons can proliferate and become annoying when they
  // feel unnecessary. So we'll only show them when the parent would benefit
  // significantly from full screen mode.
  useElementSize(parentRef, (size) => {
    // Check if the parent is significantly smaller (<=80%) than the viewport
    // in either dimension.
    const viewport = document.documentElement;
    const isSmall =
      size.width / viewport.clientWidth <= threshold ||
      size.height / viewport.clientHeight <= threshold;
    const shouldDisable = !isSmall;
    if (shouldDisable !== disabled) setDisabled(shouldDisable);
  });

  // We don't want to animate to full screen if we are *starting* full screen.
  const skipAnimation = useRef(isFullScreen);

  // Toggle full screen status with a hotkey.
  useHotkey(hotkey, {
    target: parentRef,
    onPress: () => setFullScreen(!isFullScreen),
  });

  useLayoutEffect(() => {
    // Create our managed <div> that React will render everything inside.
    const div = document.createElement("div");
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.position = "absolute";
    divRef.current = div;

    // Make sure we render again now that divRef.current is defined.
    setForceRefresh(Date.now());

    return () => {
      divRef.current = null;
      div.remove();
      skipAnimation.current = isFullScreen; // Reset because of <StrictMode> double-effects.
    };
  }, []);

  useLayoutEffect(() => {
    const div = divRef.current;
    const parent = parentRef.current;

    if (!div || !parent) return; // Shouldn't happen.

    const header = parent.querySelector("#header") as HTMLElement | null;

    const rect = parent.getBoundingClientRect();

    // Our "full screen" will be limited to any ModalProviders if present.
    const [top, topRect] = (() => {
      if (modalRoot.current?.parentElement) {
        return [
          modalRoot.current, // This is the DOM element we want to be inside (in case a parent of ours displays a modal, we don't want to cover it up!)
          modalRoot.current.parentElement.getBoundingClientRect(), // This is the DOM element we want to measure against (modalRoot is absolutely-positioned with 0 height).
        ];
      } else {
        return [document.body, document.body.getBoundingClientRect()];
      }
    })();

    if (isFullScreen) {
      // Relocate the content to the top element if needed.
      if (div.parentElement !== top) {
        // Move it to the body where we can freely animate it.
        top.appendChild(div);
        div.style.top = rect.top - topRect.top + "px";
        div.style.left = rect.left - topRect.left + "px";
        div.style.width = rect.width + "px";
        div.style.height = rect.height + "px";
        if (header) header.style.opacity = "0";

        const moveDivToTop = () => {
          div.style.top = "34px"; // Make space for header.
          div.style.left = "0";
          div.style.width = "100%";
          div.style.height = "calc(100% - 34px)";
          if (header) header.style.opacity = "";
        };

        if (skipAnimation.current) {
          div.style.transition = "";
          moveDivToTop();
          skipAnimation.current = false;
        } else {
          // Begin expanding it immediately.
          requestAnimationFrame(() => {
            div.style.transition =
              "left 0.3s ease-in-out, top 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out";
            moveDivToTop();
          });
        }
      }
    } else {
      // Relocate the content to our parent element if needed.
      if (div.parentElement !== parent) {
        // Contract it to our parent's dimensions before relocating.
        div.style.transition =
          "left 0.3s ease-in-out, top 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out";
        div.style.top = rect.top - topRect.top + "px";
        div.style.left = rect.left - topRect.left + "px";
        div.style.width = rect.width + "px";
        div.style.height = rect.height + "px";

        // Relocate after the transition completes.
        const relocate = () => {
          parent.appendChild(div);
          div.style.transition = "";
          div.style.top = "0";
          div.style.left = "0";
          div.style.width = "100%";
          div.style.height = "100%";
        };

        // Don't delay if we aren't even in the DOM yet!
        if (!div.parentElement) {
          relocate();
        } else {
          // Wait for animation to complete.
          setTimeout(relocate, 300);
        }
      }
    }
  }, [forceRefresh, isFullScreen]);

  const rendered = (
    <ContentLayout data-is-fullscreen={isFullScreen}>
      <FullScreenHeader id="header">
        <div className="title" children={title} />
        <Button icon={<Close />} onClick={() => setFullScreen(false)} />
      </FullScreenHeader>
      <div className="children">{children}</div>
      {!isFullScreen && !disabled && (
        <Button
          className="full-screen-button"
          icon={<FullScreen />}
          onClick={() => setFullScreen(true)}
        />
      )}
    </ContentLayout>
  );

  return (
    <StyledFullScreenView ref={parentRef} {...rest}>
      <FullScreenContext.Provider value={{ isFullScreen, disabled }}>
        {divRef.current && createPortal(rendered, divRef.current)}
      </FullScreenContext.Provider>
    </StyledFullScreenView>
  );
}

// Make a context provider so children can detect if they're being rendered
// in full-screen mode.

export interface FullScreenContextValue {
  isFullScreen: boolean;
  disabled: boolean;
}

export const FullScreenContext = createContext<FullScreenContextValue>({
  isFullScreen: false,
  disabled: true,
});
FullScreenContext.displayName = "FullScreenContext";

export function useFullScreen(): FullScreenContextValue {
  return useContext(FullScreenContext);
}

export const StyledFullScreenView = styled.div`
  position: relative;
`;

const FullScreenHeader = styled.div`
  display: flex;
  flex-flow: row;
  background: ${colors.darkBlue()};
  height: 34px;
  overflow: hidden;

  > .title {
    align-self: center;
    margin-left: 10px;
    flex-grow: 1;
    font: ${fonts.display({ size: 12 })};
    color: ${colors.white()};
  }

  > ${StyledButton} {
    flex-shrink: 0;
    background: none;
    color: ${colors.white()};
  }
`;

const ContentLayout = styled.div`
  background: ${colors.textBackground()};
  position: relative;
  height: 100%;

  > ${FullScreenHeader} {
    position: absolute;
    z-index: 1;
    top: -34px;
    left: 0px;
    right: 0px;
    height: 34px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-in-out;
  }

  > .children {
    position: absolute;
    z-index: 0;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    flex-flow: column;

    > * {
      height: 0;
      flex-grow: 1;
    }
  }

  &[data-is-fullscreen="true"] {
    > ${FullScreenHeader} {
      opacity: 1;
      pointer-events: auto;
    }
  }

  > .full-screen-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: ${colors.darkBlue()};
    color: ${colors.white()};
    z-index: 1;
  }
`;

/**
 * Creates a blank space for a <Toolbar>, sized to match the FullScreenView
 * "expand" button, that only appears when the FullScreenView is not in full
 * screen mode.
 */
export function FullScreenToolbarSpace() {
  const { isFullScreen, disabled } = useFullScreen();
  return !isFullScreen && !disabled ? <ToolbarSpace width={40} /> : null;
}
