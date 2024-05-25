import { CSSProperties, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { useRouter } from "../../router/context/RouterContext.js";

export function ListLayout({
  fixedWidth = 200,
  fixedSide = "left",
  children,
}: {
  fixedWidth?: number;
  fixedSide?: "left" | "right";
  children?: ReactNode;
}) {
  const { location } = useRouter();

  // If the location at this point in the hierarchy is "fully claimed"
  // then we assume that we should be showing the list. Essentially,
  // we are assuming that if you *had* selected something in the list
  // the resulted in showing a content view, then the location *at this point
  // in the hierarchy* would have more stuff after it to be "claimed" by the
  // content pane.
  const showListOnly = !location.unclaimedHref();

  const cssProps = {
    "--fixed-width": fixedWidth + "px",
  } as CSSProperties;

  return (
    <StyledListLayout
      style={cssProps}
      data-fixed-side={fixedSide}
      data-show-list-only={!!showListOnly}
      children={children}
    />
  );
}

export const StyledListLayout = styled.div`
  display: flex;
  flex-flow: row;
  position: relative;

  &[data-fixed-side="left"] {
    /* List */
    > *:nth-child(1) {
      flex-shrink: 0;
      width: var(--fixed-width);
      box-shadow: 1px 0 0 ${colors.separator()};
      z-index: 1;
    }

    /* Content */
    > *:nth-child(2) {
      width: 0;
      flex-grow: 1;
      z-index: 0;
    }
  }

  &[data-fixed-side="right"] {
    /* List */
    > *:nth-child(1) {
      width: 0;
      flex-grow: 1;
      z-index: 0;
    }

    /* Content */
    > *:nth-child(2) {
      flex-shrink: 0;
      width: var(--fixed-width);
      max-width: 100%; /* Allow it to get smaller on small screens. */
      box-shadow: -1px 0 0 ${colors.separator()};
      z-index: 1;
    }
  }

  /* Mobile layout */
  @media (max-width: 950px) {
    /* If we're short on horizontal space, then we want to only show one pane
       at a time. We use the current location to determine if we should be
       showing the "list" or "content" pane. Note that the content pane may
       itself be another <ListLayout>! */

    &[data-show-list-only="true"] {
      /* List */
      > *:nth-child(1) {
        width: 0;
        flex-grow: 1;
      }

      /* Content */
      > *:nth-child(2) {
        display: none;
      }
    }

    &[data-show-list-only="false"] {
      /* List */
      > *:nth-child(1) {
        display: none;
      }

      /* Content */
      > *:nth-child(2) {
        /* Make it grow to fill the viewport even if fixedSide === "right" */
        flex-grow: 1;
      }
    }
  }
`;
