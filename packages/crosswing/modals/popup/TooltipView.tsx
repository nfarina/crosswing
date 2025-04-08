import { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { colors, shadows } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { PopupView } from "./PopupView.js";

export function TooltipView({
  tooltip: tooltipText,
  target,
  children,
  ...rest
}: Parameters<typeof PopupView>[0] & {
  /** Can be HTML. */
  tooltip?: string;
  /**
   * Target element to point at, will pull the tooltip text from here if children
   * are not provided.
   */
  target: Element;
}) {
  const [text, setText] = useState("");
  const [destructive, setDestructive] = useState(false);

  // Sign up for mouseout events on the target so we can close ourself.
  useLayoutEffect(() => {
    if (!target) return;

    const handleMouseOut = () => {
      rest.onClose?.();
    };

    target.addEventListener("mouseleave", handleMouseOut);

    return () => {
      target.removeEventListener("mouseleave", handleMouseOut);
    };
  }, [target]);

  useLayoutEffect(() => {
    // If we have direct children, we don't need to do anything here.
    if (children) return;

    const updateState = () => {
      const tooltip = tooltipText ?? target?.getAttribute("data-tooltip");
      const hidden = target?.getAttribute("data-tooltip-hidden") === "true";
      const destructive =
        target?.getAttribute("data-tooltip-destructive") === "true";

      if (hidden) {
        rest.onClose?.();
      }

      setText(tooltip ?? "Missing tooltip");
      setDestructive(destructive);
    };

    updateState();

    if (!target) return;

    // Sign up for mutation events on the target so we can update our state.
    const observer = new MutationObserver(updateState);
    observer.observe(target, { attributes: true });

    return () => observer.disconnect();
  }, [children, tooltipText, target]);

  return (
    <StyledTooltipView
      // Take colors from <StatusBadge>.
      background={
        destructive ? colors.red({ lighten: 0.25 }) : colors.extraDarkGray()
      }
      backgroundDark={
        destructive ? colors.red({ darken: 0.55 }) : colors.extraLightGray()
      }
      arrowBackground={
        destructive ? colors.red({ lighten: 0.25 }) : colors.extraDarkGray()
      }
      arrowBackgroundDark={
        destructive ? colors.red({ darken: 0.55 }) : colors.extraLightGray()
      }
      outlineBorder={!destructive}
      data-destructive={destructive}
      {...rest}
    >
      {children ?? <div dangerouslySetInnerHTML={{ __html: text }} />}
    </StyledTooltipView>
  );
}

export const StyledTooltipView = styled(PopupView)`
  /* Don't accidentally capture the mouse as it's moving between targets. */
  pointer-events: none !important; /* Override usePopup's pointer-events: auto. */
  color: ${colors.extraLightGray()};

  @media (prefers-color-scheme: dark) {
    color: ${colors.extraDarkGray()};
  }

  &[data-destructive="true"] {
    color: ${colors.red({ darken: 0.45 })};

    @media (prefers-color-scheme: dark) {
      color: ${colors.red({ lighten: 0.2 })};
    }
  }

  > .children {
    /* Add some default style to the content. */
    font: ${fonts.displayMedium({ size: 13, line: "17px" })};
    word-break: break-word;
    padding: 6px 8px;
    text-align: center;
    /* Drop the really big super subtle shadow added by PopupView (tooltips are so small that's very noticeable) */
    box-shadow: ${shadows.cardSmall()}, ${shadows.cardBorder()} !important;
  }

  &[data-placement="left"] {
    > .children {
      text-align: left;
    }
  }

  &[data-placement="right"] {
    > .children {
      text-align: left;
    }
  }
`;
