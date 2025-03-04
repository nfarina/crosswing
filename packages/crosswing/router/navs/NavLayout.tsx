import { HTMLAttributes, ReactNode, use } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { HostContext } from "../../host/context/HostContext.js";
import { useHostStatusBar } from "../../host/features/HostStatusBar.js";
import { StatusBarStyleAttribute } from "../../host/util/useAutoStatusBar.js";
import { BackIcon } from "../../icons/Back.js";
import { safeArea } from "../../safearea/safeArea.js";
import { RouterContext } from "../context/RouterContext.js";
import { NavAccessory, NavAccessoryView } from "./NavAccessoryView.js";
import { NavTitleView } from "./NavTitleView.js";

export interface NavProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  left?: NavAccessory | null;
  right?: NavAccessory | null;
  /** Custom "back" accessory, only rendered when the back arrow would otherwise be rendered. */
  back?: Omit<NavAccessory, "to" | "back"> | null;
  disabled?: boolean;
  /** If provided, the back button will always go to this path instead of cycling back through history. */
  backTo?: string | null;
  /** Pass true to hide the hairline shadow under the nav bar. */
  hideSeparator?: boolean;
  /** Pass true to hide the auto-generated back button (if displayed). */
  hideBackButton?: boolean;
  /** Pass true to hide the tab bar, if presented inside <Tabs>. */
  hideTabBar?: boolean;
  /** Pass true to render a transparent header. */
  transparentHeader?: boolean;
  /** Pass true to lay out any children below the nav bar area. */
  fullBleed?: boolean;
  /** Pass true to render a subtle dark gradient under the status bar area to increase text readability. Only rendered when `fullBleed` is true and on a supported platform. */
  darkenUnderStatusBar?: boolean;
  /** Pass true to indicate that, on mobile devices where content could sit underneath the system status bar, that the system status bar text should be white. */
  lightStatusBar?: boolean;
  /** Pass true to hide the nav bar entirely. */
  hidden?: boolean;
  /** Marks this NavLayout as not having a way to go "back". Essential for good behavior on Android.  */
  isApplicationRoot?: boolean;
  /** Pass true to make the nav content area determine the height of the layout. */
  fitContent?: boolean;
}

export function NavLayout({
  title,
  subtitle,
  children,
  left,
  right,
  back: customBackAccessory,
  disabled,
  hideSeparator,
  hideBackButton,
  hideTabBar,
  backTo,
  transparentHeader,
  fullBleed,
  darkenUnderStatusBar,
  lightStatusBar,
  hidden,
  isApplicationRoot,
  fitContent,
  ...rest
}: NavProps & Omit<HTMLAttributes<HTMLDivElement>, "title">) {
  // Pull our back link (if any) from context.
  const { back, flags } = use(RouterContext);

  // Use the provided backTo path if any, otherwise fall back to the normal
  // back behavior.
  const resolvedBack = backTo ?? back;

  // Pull host info for safe area.
  const { container, viewport } = use(HostContext);
  const statusBar = useHostStatusBar();

  function getLeftAccessory() {
    if (left) return <NavAccessoryView accessory={left} align="left" />;

    if (back && !hideBackButton) {
      if (customBackAccessory) {
        return (
          <NavAccessoryView
            accessory={{ ...customBackAccessory, to: resolvedBack, back: true }}
            align="left"
          />
        );
      }

      return (
        <NavAccessoryView
          accessory={{ icon: <BackIcon />, to: resolvedBack, back: true }}
          align="left"
        />
      );
    }

    // We need something to take up the flex space to center the title.
    return <div />;
  }

  function getRightAccessory() {
    if (container === "ios" && viewport.keyboardVisible) {
      // No onClick handler is needed because simply clicking it will remove
      // focus from whatever is causing the keyboard to appear in the first
      // place!
      return <NavAccessoryView accessory={{ title: "Done" }} align="right" />;
    }

    if (right) return <NavAccessoryView accessory={right} align="right" />;

    return <div />;
  }

  if (
    !isApplicationRoot &&
    !left?.back &&
    !back &&
    !right?.back &&
    !flags?.isMock &&
    flags?.isMobileApp
  ) {
    console.warn(
      "Rendering a <NavLayout> without isApplicationRoot=true or any accessories marked as back=true. This will not be a good experience on Android!",
    );
  }

  return (
    <StyledNavLayout
      data-full-bleed={!!fullBleed}
      data-disabled={!!disabled}
      data-hidden={!!hidden}
      data-hide-tab-bar={!!hideTabBar}
      data-fit-content={!!fitContent}
      {...StatusBarStyleAttribute(lightStatusBar ? "light" : "default")} // Picked up on by useAutoStatusBar.
      {...rest}
    >
      <StyledNavHeader
        data-container={container}
        data-hide-separator={!!hideSeparator}
        data-transparent-header={!!transparentHeader}
      >
        {getLeftAccessory()}
        <NavTitleView title={title} subtitle={subtitle} className="center" />
        {getRightAccessory()}
      </StyledNavHeader>
      {children}
      {fullBleed && darkenUnderStatusBar && statusBar && (
        <div className="top-fade" />
      )}
    </StyledNavLayout>
  );
}

export const StyledNavHeader = styled.div`
  display: flex;
  flex-flow: row;
  box-sizing: border-box;
  height: calc(50px + ${safeArea.top()});
  border-bottom: 1px solid ${colors.separator()};
  padding-top: ${safeArea.top()};
  padding-left: ${safeArea.left()};
  padding-right: ${safeArea.right()};
  transition:
    background-color 0.2s ease-in-out,
    border-bottom-color 0.2s ease-in-out;
  background-color: transparent;
  position: relative;

  &[data-transparent-header="false"] {
    background-color: ${colors.textBackground()};
  }

  &[data-container="ios"] {
    height: calc(44px + ${safeArea.top()});
  }

  &[data-hide-separator="true"] {
    /* We don't hide the border completely because it shifts the content. There are many places where we hide the border until you scroll the content for instance. */
    border-bottom: 1px solid transparent;

    &[data-transparent-header="false"] {
      border-bottom: 1px solid ${colors.textBackground()};
    }
  }

  > *:nth-child(1) {
    flex-shrink: 0;
    width: 80px;
  }

  > *:nth-child(2) {
    margin: 0 10px;
    flex-shrink: 0;
    flex-grow: 1;
    width: 0;
  }

  > *:nth-child(3) {
    flex-shrink: 0;
    width: 80px;
  }
`;

export const StyledNavLayout = styled.div`
  display: flex;
  flex-flow: column;
  background: ${colors.textBackground()};

  /* Create new stacking context so our children's z-index will work.
     we can't "position: relative" because if we're presented in a
     <NavStack> (which we probably are) then it will assign us a
     "position: absolute". */
  isolation: isolate;

  > ${StyledNavHeader} {
    flex-shrink: 0;
    z-index: 1;
  }

  &[data-full-bleed="true"] {
    > ${StyledNavHeader} {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  }

  &[data-hidden="true"] {
    > ${StyledNavHeader} {
      display: none;
    }
  }

  /* Content */
  > *:nth-child(2) {
    height: 0;
    flex-grow: 1;
    z-index: 0;
    transition: opacity 0.2s ease-in-out;
  }

  &[data-fit-content="true"] {
    > *:nth-child(2) {
      height: auto;
      max-height: 100%;
    }
  }

  &[data-disabled="true"] {
    > *:nth-child(2) {
      opacity: 0.5;
    }
  }

  > .top-fade {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.3) 40%,
      rgba(0, 0, 0, 0)
    );
  }
`;
