import {
  CSSProperties,
  ReactNode,
  PointerEvent as ReactPointerEvent,
  useRef,
} from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { useRouter } from "../../router/context/RouterContext.js";

export function ListLayout({
  defaultWidth = 275,
  minWidth = 200,
  maxWidth = 475,
  children,
}: {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  children?: ReactNode;
}) {
  const { location } = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // If the location at this point in the hierarchy is "fully claimed"
  // then we assume that we should be showing the list. Essentially,
  // we are assuming that if you *had* selected something in the list
  // the resulted in showing a content view, then the location *at this point
  // in the hierarchy* would have more stuff after it to be "claimed" by the
  // content pane.
  const showListOnly = !location.unclaimedHref();

  const cssProps = {
    "--list-width": defaultWidth + "px",
  } as CSSProperties;

  function onDraggerPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault();

    const container = ref.current;
    if (!container) return;

    const listWidth = parseInt(
      container.style.getPropertyValue("--list-width") || "-1",
    );

    // The maximum list width is the width of the container.
    const listMaxWidth = container.clientWidth;

    const startX = e.clientX;
    const startWidth = listWidth;
    let hasDraggedMoreThan10px = false;

    const onPointerMove = (e: PointerEvent) => {
      const diff = e.clientX - startX;
      let newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + diff));

      if (Math.abs(diff) > 10) {
        hasDraggedMoreThan10px = true;
      }

      // We want to "snap" to either the default width, min width, or max width,
      // if we are within 10 pixels of them. But not before we've dragged more
      // than 10 pixels, because otherwise it feels weird.
      if (hasDraggedMoreThan10px) {
        const snapWidths = [defaultWidth, minWidth, maxWidth];

        const closestSnapWidth = snapWidths.reduce((prev, curr) =>
          Math.abs(curr - newWidth) < Math.abs(prev - newWidth) ? curr : prev,
        );

        if (Math.abs(newWidth - closestSnapWidth) < 10) {
          newWidth = closestSnapWidth;
        }
      }

      container.style.setProperty("--list-width", newWidth + "px");
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  return (
    <StyledListLayout
      ref={ref}
      style={cssProps}
      data-show-list-only={!!showListOnly}
    >
      {children}
      <div className="dragger" onPointerDown={onDraggerPointerDown}>
        <div className="drag-handle" />
      </div>
    </StyledListLayout>
  );
}

export const StyledListLayout = styled.div`
  display: flex;
  flex-flow: row;
  position: relative;

  /* List */
  > *:nth-child(1) {
    flex-shrink: 0;
    width: var(--list-width);
    box-shadow: 1px 0 0 ${colors.separator()};
    z-index: 1;
    position: relative;
  }

  /* Content */
  > *:nth-child(2) {
    width: 0;
    flex-grow: 1;
    z-index: 0;
  }

  /* Dragger */
  > .dragger {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    left: calc(var(--list-width) - 5px);
    width: 10px;
    cursor: ew-resize;

    > .drag-handle {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 4px;
      transform: translateX(-50%);
      background: ${colors.lightBlue()};
      opacity: 0;
      transition: opacity 0.2s ease-in-out;

      @media (prefers-color-scheme: dark) {
        background: ${colors.darkBlue()};
      }
    }

    &:hover {
      > .drag-handle {
        /* Too distracting. */
        /* opacity: 1; */
      }
    }
  }

  /* Mobile layout */
  @media (max-width: 950px) {
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
        flex-grow: 1;
      }
    }
  }
`;
