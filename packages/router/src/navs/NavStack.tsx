import { useGesture } from "@cyber/hooks/useGesture";
import { HostContainer, useHost } from "@cyber/host/context";
import { colors } from "@cyber/theme/colors";
import { easing } from "@cyber/theme/easing";
import React, { ReactElement, cloneElement, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { keyframes, styled } from "styled-components";
import { useRouter } from "../context/RouterContext.js";
import { RouterLocation } from "../history/RouterLocation.js";

export function NavStack({
  back,
  children,
}: {
  back: RouterLocation | null;
  children: ReactElement<any>[];
}) {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const { history } = useRouter();
  const { container } = useHost();

  /**
   * Loops over the stack items and adds `aria-hidden` to all but the last.
   * This is necessary to prevent screen readers from "seeing" the inactive
   * content that's behind the current screen.
   *
   * This is done as DOM operation instead of modifying the `{child}` so that we
   * don't incorrectly assign the attribute to something like a <Content.Provider>.
   */
  useEffect(() => {
    const stackEl = stackRef.current;
    if (!stackEl) return;

    const observeMutations = () => {
      for (let i = stackEl.children.length - 1; i >= 0; i--) {
        const child = stackEl.children[i];
        if (i === stackEl.children.length - 1) {
          child.setAttribute("aria-hidden", "false");
        } else {
          child.setAttribute("aria-hidden", "true");
        }
      }
    };

    const observer = new MutationObserver(observeMutations);
    observer.observe(stackEl, { childList: true });

    return () => observer.disconnect();
  }, []);

  // On iOS devices, we allow you to swipe right from the left edge of the
  // stack to go back, similar to native apps.
  const onTouchStart = useGesture({
    active: !!back,
    edge: "left",
    direction: "right",
    onGestureComplete: () => history.navigate(back!.href()),
  });

  return (
    <StyledNavStack
      onTouchStart={container === "wkwebview" ? onTouchStart : undefined}
      data-container={container}
    >
      <TransitionGroup component={null}>
        {children.map((child) => (
          <CSSTransition
            key={String(child.key)}
            classNames="page"
            unmountOnExit
            timeout={{
              enter: container !== "web" ? 400 + 250 : 0,
              exit: container !== "web" ? 300 : 0,
            }}
          >
            {child}
          </CSSTransition>
          // <NavStackItem
          //   key={String(child.key)}
          //   container={container}
          //   child={child}
          // />
        ))}
      </TransitionGroup>
    </StyledNavStack>
  );
}

// Not working quite yet; the transitions aren't animating. No time to fix, and
// we're not running in StrictMode yet, so we'll defer this for later.
function NavStackItem({
  container,
  child,
  ...transitionGroupProps
}: {
  container: HostContainer;
  child: ReactElement<any>;
}) {
  // Use refs so CSSTransition doesn't use the deprecated `findDOMNode` API.
  const ref = useRef(null);

  return (
    <CSSTransition
      classNames="page"
      unmountOnExit
      nodeRef={ref}
      timeout={{
        enter: container !== "web" ? 400 + 250 : 0,
        exit: container !== "web" ? 300 : 0,
      }}
      {...transitionGroupProps}
    >
      {cloneElement(child, { ref })}
    </CSSTransition>
  );
}

const slideIn = keyframes`
  from {
    transform: translateX(calc(100% + 20px));
  }
`;

const slideOut = keyframes`
  to {
    transform: translateX(calc(100% + 20px));
  }
`;

const popIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
`;

const popOut = keyframes`
  to {
    transform: scale(0.9);
    opacity: 0;
  }
`;

const boxShadow = "-4px 0px 20px " + colors.black({ alpha: 0.2 });

export const StyledNavStack = styled.div`
  position: relative;
  overflow: hidden;

  > * {
    position: absolute;
    /* Strangely, "0px" is required (not "0") for the app to look right in FullStory while running in Safari. */
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }

  /* Hide all except the last two to (maybe) increase browser render performance. */
  > :not(:nth-last-child(-n + 2)) {
    display: none;
  }

  &[data-container="wkwebview"] {
    > .page-enter-active {
      animation: ${slideIn} 0.4s ${easing.outCubic} backwards;
      /* This makes the animation smoother as React has a chance to render the content first. */
      animation-delay: 250ms;
      box-shadow: ${boxShadow};
    }

    > .page-exit-active {
      animation: ${slideOut} 0.25s ${easing.inSine} forwards;
      box-shadow: ${boxShadow};
    }
  }

  &[data-container="android"] {
    > .page-enter-active {
      animation: ${popIn} 0.3s ${easing.outCubic} backwards;
      /* This makes the animation smoother as React has a chance to render the content first. */
      animation-delay: 250ms;
    }

    > .page-exit-active {
      animation: ${popOut} 0.25s ${easing.inCubic} forwards;
    }
  }
`;
