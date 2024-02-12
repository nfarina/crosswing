import {
  CSSProperties,
  ReactElement,
  ReactNode,
  isValidElement,
  useState,
} from "react";
import { styled } from "styled-components";
import { colors, shadows } from "../colors/colors.js";
import { fonts } from "../fonts/fonts.js";
import { flattenChildren } from "../hooks/flattenChildren.js";
import { useDebounced } from "../hooks/useDebounced.js";
import { useResettableState } from "../hooks/useResettableState.js";
import { useHost } from "../host/context/HostContext.js";
import { useRouter } from "../router/context/RouterContext.js";
import { Redirect } from "../router/redirect/Redirect.js";
import { UnreadBadge } from "../router/tabs/UnreadBadge.js";
import { easing } from "../shared/easing.js";
import { Button } from "./Button.js";

export interface TabbedButtonProps {
  title: ReactNode;
  /** Allow any value type in case you want to use enums. */
  value?: any;
  children?: ReactNode;
  lazy?: boolean;
  /** Badges the tab like the mobile tab bar. */
  badge?: number | null;
}

export function TabbedButtonLayout({
  value,
  defaultValue,
  onValueChange,
  primary,
  layout = "panel",
  searchParam,
  disabled,
  children,
}: {
  value?: any;
  defaultValue?: any;
  onValueChange?: (value: any) => any;
  /** Set to true for a much bigger and bolder style. */
  primary?: boolean;
  /** I forget exactly why these are different but most of the time I think "panel" is desired. */
  layout?: "panel" | "page";
  /** If defined, will store the current tab value in the querystring (using router). */
  searchParam?: string;
  disabled?: boolean;
  children?:
    | Array<ReactElement<TabbedButtonProps> | null | boolean>
    | ReactElement<TabbedButtonProps>
    | null
    | boolean;
}) {
  // We always want to render using "nextLocation" instead of "location" because
  // content may be loading via <Suspense> and we want to highlight the tab that
  // will be selected next regardless of that loading state.
  const { history, location, nextLocation: anyNextLocation } = useRouter();
  const { container } = useHost();

  // The nextLocation could be _anywhere_. We only want to pre-render the
  // active button if the path matches our current location. Otherwise we might
  // want to highlight the default first button when no querystring is present
  // (because we're going to like, another screen entirely, or navigating
  // backwards in a <Navs>).
  const nextLocation =
    anyNextLocation.claimedPath() === location.claimedPath()
      ? anyNextLocation
      : location;

  // Coerce children to array, flattening fragments and falsy conditionals.
  const buttons = flattenChildren(children).filter(isTabbedButton);

  // What React wants us to render right now, possibly suspended.
  const paramValue = searchParam && location.searchParams().get(searchParam);
  const paramChild =
    paramValue && buttons.find((c) => c.props.value === paramValue);

  // What we will be rendering next, possibly suspended.
  const nextParamValue =
    searchParam && nextLocation.searchParams().get(searchParam);

  const [innerValue, setInnerValue] = useResettableState(() => {
    return nextParamValue ?? defaultValue ?? buttons[0]?.props.value ?? 0;
  }, [nextParamValue, defaultValue, buttons.length]);

  // Keep track of child values we've rendered, for lazy children.
  const [renderedValues, setRenderedValues] = useState<Set<string>>(new Set());

  const resolvedValue = value ?? innerValue;
  const selectedIndex = buttons.findIndex(
    (child, i) => (child.props.value ?? i) === resolvedValue,
  );

  // Wait to render our children until after the tab animation is complete,
  // only when running in a native Android app, otherwise it feels choppy.
  const delay = container === "android" ? 300 : 0;
  const debouncedValue = useDebounced(resolvedValue, { delay });

  function selectTab(newValue: any) {
    onValueChange?.(newValue);

    if (!value) {
      // "Uncontrolled" component, use our own state.
      setInnerValue(newValue);

      // Update our router's location with the new search param value if needed.
      if (searchParam) {
        const newLocation = nextLocation.withParam(searchParam, newValue);
        history.navigate(newLocation.href(), { replace: true });
      }
    }
  }

  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    const track = (e.target as HTMLElement).parentElement!;

    function onTouchMove(e: TouchEvent) {
      const rect = track.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left; // x position within the track.

      const childWidth = rect.width / buttons.length;
      let childIndex = Math.floor(x / childWidth);
      childIndex = Math.max(childIndex, 0);
      childIndex = Math.min(childIndex, buttons.length - 1);
      const child = buttons[childIndex];
      selectTab(child.props.value ?? childIndex);
    }

    function onTouchEnd(e: TouchEvent) {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    }

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }

  // Update our rendered values with whatever we are rendering.
  if (!renderedValues.has(debouncedValue)) {
    const nowRendered = new Set(renderedValues);
    nowRendered.add(debouncedValue);
    setRenderedValues(nowRendered);
  }

  function renderChild(child: ReactElement<TabbedButtonProps>, i: number) {
    const childValue = child.props.value ?? i;

    if (child.props.lazy && !renderedValues.has(childValue)) {
      // Don't render this value unless it's been selected before.
      return null;
    }

    return (
      <div
        key={String(childValue)}
        className="tab-content"
        children={child.props.children}
        data-selected={childValue === debouncedValue}
      />
    );
  }

  const cssProps = {
    "--selected-index": selectedIndex,
    "--child-count": buttons.length,
  } as CSSProperties;

  // Using our Router integration, and trying to render an invalid paramValue?
  // Redirect to our first child's value if it defines one.
  // Note that we are not using the "nextLocation" value here, because we want
  // React might be concurrently rendering us.
  if (
    searchParam &&
    !!paramValue &&
    !paramChild &&
    buttons.length > 1 &&
    buttons[0].props.value
  ) {
    return (
      <Redirect
        to={location.withParam(searchParam, buttons[0].props.value).href()}
      />
    );
  }

  return (
    <StyledTabbedButtonLayout
      data-primary={!!primary}
      data-layout={layout}
      data-hide-tabs={buttons.length === 1}
      data-disabled={!!disabled}
      style={cssProps}
    >
      <div className="tabs" role="tablist">
        <div className="track">
          <div className="background" onTouchStart={onTouchStart} />
          {buttons.map((child, i) => (
            <Button
              primary
              disabled={!!disabled}
              key={String(child.props.value ?? i)}
              data-selected={(child.props.value ?? i) === resolvedValue}
              onClick={() => selectTab(child.props.value ?? i)}
              role="tab"
              aria-selected={(child.props.value ?? i) === resolvedValue}
            >
              <TabButtonContent>
                {child.props.title}
                {child.props.badge ? (
                  <UnreadBadge children={child.props.badge} />
                ) : null}
              </TabButtonContent>
            </Button>
          ))}
        </div>
      </div>
      <div className="content">{buttons.map(renderChild)}</div>
    </StyledTabbedButtonLayout>
  );
}

export const StyledTabbedButtonLayout = styled.div`
  display: flex;
  flex-flow: column;

  > .tabs {
    flex-shrink: 0;
    padding: 20px 10px;
    display: flex;
    flex-flow: column;
  }

  &[data-hide-tabs="true"] {
    > .tabs {
      display: none;
    }
  }

  &[data-primary="false"] > .tabs > .track {
    display: flex;
    flex-flow: row;
    background: ${colors.lightGray()};
    border-radius: 10px;
    position: relative;
    min-height: 38px;

    @media (prefers-color-scheme: dark) {
      background: ${colors.textBackgroundPanel()};
    }

    > .background {
      position: absolute;
      transition: left 0.3s ${easing.outCubic};
      left: calc(4px + var(--selected-index) * (100% / var(--child-count)));
      top: 4px;
      width: calc((100% / var(--child-count)) - 4px * 2);
      height: calc(100% - 4px * 2);
      background: ${colors.textBackground()};
      border-radius: 6px;
      box-shadow: ${shadows.cardSmall()};
    }

    > button {
      width: 0;
      flex-grow: 1;
      flex-shrink: 0;
      background: none;
      z-index: 1;
      font: ${fonts.displayMedium({ size: 14 })};
      color: ${colors.text()};

      &[data-selected="true"] {
        font: ${fonts.displayBold({ size: 14 })};
        pointer-events: none;
      }
    }
  }

  &[data-primary="true"] > .tabs > .track {
    display: flex;
    flex-flow: row;

    > .background {
      display: none;
    }

    > button {
      width: 0;
      flex-grow: 1;
      flex-shrink: 0;
      height: 40px;
      transition: transform linear 0.1s;

      &[data-selected="false"] {
        background: transparent;
        font: ${fonts.display({ size: 14 })};
        color: ${colors.text()};
        box-shadow: ${shadows.cardBorder()}, ${shadows.cardSmall()};
        transform: translateY(-2px);

        @media (prefers-color-scheme: dark) {
          box-shadow: ${shadows.cardSmall()};
        }
      }
    }

    > button + button {
      margin-left: 10px;
    }
  }

  &[data-layout="panel"] > .content {
    height: 0;
    flex-grow: 1;
    position: relative;

    > .tab-content {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      display: flex;

      > * {
        flex-grow: 1;
      }
    }

    > .tab-content[data-selected="false"] {
      display: none;
    }
  }

  &[data-layout="page"] > .content {
    flex-shrink: 0;

    > .tab-content[data-selected="false"] {
      display: none;
    }
  }

  &[data-disabled="true"] {
    pointer-events: none;
  }
`;

export function TabbedButton(props: TabbedButtonProps) {
  return null; // Doesn't actually render anything, just captures props.
}
// We use this instead of comparing item.type === TabbedButton because that class
// pointer is not stable during development with hot reloading.
TabbedButton.isTabbedButton = true;

function isTabbedButton(
  child: ReactNode,
): child is ReactElement<TabbedButtonProps> {
  return isValidElement(child) && !!child.type?.["isTabbedButton"];
}

const TabButtonContent = styled.div`
  position: relative;

  > ${UnreadBadge} {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -20px;
  }
`;
