import { useHotkey } from "@cyber/hooks/useHotkey";
import { useSessionStorage } from "@cyber/hooks/useSessionStorage";
import { ModalContext } from "@cyber/modals/context";
import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import Close from "@cyber/theme/icons/Close.svg";
import FullScreen from "@cyber/theme/icons/FullScreen.svg";
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { Button, StyledButton } from "../Button.js";

export function FullScreenView({
  restorationKey,
  title,
  hotkey = "cmd+shift+f",
  children,
}: {
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
  children: ReactElement;
}) {
  // Fit our "full screen" rect to the nearest modal provider boundary.
  const { modalRoot } = useContext(ModalContext);

  const [, forceRefresh] = useState(0);

  // This is our "natural" parent.
  const parentRef = useRef<HTMLDivElement | null>(null);

  // This is what React will render us into.
  const divRef = useRef<HTMLDivElement | null>(null);

  // Persist the fullscreen status across window reloads (don't use
  // localStorage because then other unrelated tabs would be affected).
  const [isFullScreen, setFullScreen] = useSessionStorage(
    `FullScreenView:${restorationKey.name}:isFullScreen`,
    false,
  );

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
    forceRefresh(Date.now());

    return () => {
      divRef.current = null;
      div.remove();
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

        // Begin expanding it immediately.
        requestAnimationFrame(() => {
          div.style.transition =
            "left 0.3s ease-in-out, top 0.3s ease-in-out, width 0.3s ease-in-out, height 0.3s ease-in-out";
          div.style.top = "34px"; // Make space for header.
          div.style.left = "0";
          div.style.width = "100%";
          div.style.height = "calc(100% - 34px)";
          if (header) header.style.opacity = "";
        });
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
      {!isFullScreen && (
        <Button
          className="full-screen-button"
          icon={<FullScreen />}
          onClick={() => setFullScreen(true)}
        />
      )}
    </ContentLayout>
  );

  return (
    <StyledFullScreenView ref={parentRef}>
      <FullScreenContext.Provider value={{ isFullScreen }}>
        {divRef.current && createPortal(rendered, divRef.current)}
      </FullScreenContext.Provider>
    </StyledFullScreenView>
  );
}

// Make a context provider so children can detect if they're being rendered
// in full-screen mode.

export interface FullScreenContextValue {
  isFullScreen: boolean;
}

export const FullScreenContext = createContext<FullScreenContextValue>({
  isFullScreen: false,
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
