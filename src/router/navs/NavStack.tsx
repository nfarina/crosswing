import { ReactElement, RefObject } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { styled } from "styled-components";
import { useGesture } from "../../hooks/useGesture";
import { useHost } from "../../host/context/HostContext";
import { colors } from "../../theme/colors/colors";
import { easing } from "../../theme/easing";
import { RouterLocation } from "../RouterLocation";
import {
  RouterContext,
  RouterContextValue,
  useRouter,
} from "../context/RouterContext";

export type NavStackItem = {
  key: string;
  childContext: RouterContextValue;
  child: ReactElement<any>;
  ref: RefObject<HTMLDivElement>;
};

export function NavStack({
  back,
  items,
}: {
  back: RouterLocation | null;
  items: NavStackItem[];
}) {
  // const stackRef = useRef<HTMLDivElement | null>(null);
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
  // useEffect(() => {
  //   const stackEl = stackRef.current;
  //   if (!stackEl) return;

  //   const observeMutations = () => {
  //     for (let i = stackEl.children.length - 1; i >= 0; i--) {
  //       const child = stackEl.children[i];
  //       if (i === stackEl.children.length - 1) {
  //         child.setAttribute("aria-hidden", "false");
  //       } else {
  //         child.setAttribute("aria-hidden", "true");
  //       }
  //     }
  //   };

  //   const observer = new MutationObserver(observeMutations);
  //   observer.observe(stackEl, { childList: true });

  //   return () => observer.disconnect();
  // }, []);

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
      onTouchStart={container === "ios" ? onTouchStart : undefined}
      data-container={container}
    >
      <TransitionGroup component={null}>
        {items.map((item) => (
          <CSSTransition
            key={item.key}
            nodeRef={item.ref}
            unmountOnExit
            timeout={{
              enter: container !== "web" ? 400 + 250 : 0,
              exit: container !== "web" ? 300 : 0,
            }}
          >
            <div className="item" ref={item.ref}>
              <RouterContext.Provider value={item.childContext}>
                {item.child}
              </RouterContext.Provider>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </StyledNavStack>
  );
}

export const StyledNavStack = styled.div`
  position: relative;
  overflow: hidden;

  > .item {
    position: absolute;
    /* Strangely, "0px" is required (not "0") for the app to look right in FullStory while running in Safari. */
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;

    /* Whatever the single child of item is. */
    > * {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
    }
  }

  /* Hide all except the last two to (maybe) increase browser render performance. */
  > .item:not(:nth-last-child(-n + 2)) {
    display: none;
  }

  &[data-container="ios"] {
    > .item.enter {
      transform: translateX(calc(100% + 20px));
    }

    > .item.enter-active {
      transform: none;
      transition: transform 0.4s ${easing.outCubic};
      /* This makes the animation smoother as React has a chance to render the content first. */
      transition-delay: 250ms;
      box-shadow: -4px 0px 20px ${colors.black({ alpha: 0.2 })};
    }

    > .item.exit {
      transition: transform 0.3s ${easing.inCubic};
      transform: none;
    }

    > .item.exit-active {
      transform: translateX(calc(100% + 20px));
      box-shadow: -4px 0px 20px ${colors.black({ alpha: 0.2 })};
    }
  }

  &[data-container="android"] {
    > .item.enter {
      transform: scale(0.9);
      opacity: 0;
    }

    > .item.enter-active {
      transform: none;
      opacity: 1;
      transition:
        transform 0.3s ${easing.outCubic},
        opacity 0.3s ${easing.outCubic};
      /* This makes the animation smoother as React has a chance to render the content first. */
      transition-delay: 250ms;
    }

    > .item.exit {
      transform: none;
      opacity: 1;
    }

    > .item.exit-active {
      transform: scale(0.9);
      opacity: 0;
      transition:
        transform 0.25s ${easing.inCubic},
        opacity 0.25s ${easing.inCubic};
    }
  }
`;
