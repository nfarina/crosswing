import {
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  useRef,
} from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { useElementSize } from "../../hooks/useElementSize.js";
import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import { useRouter } from "../../router/context/RouterContext.js";

export function ListLayout({
  defaultWidth = 275,
  minWidth = 200,
  maxWidth = 475,
  restorationKey,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  /**
   * Allows the parent component to store the sidebar width in a persistent way.
   * This could be a string but then it's easy to forget to change the string
   * when copy/pasting code, so it's a function instead, typically your
   * component function, which we'll access the `name` property of.
   */
  restorationKey: Function;
}) {
  const { location } = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // Persist the list width across window reloads.
  const [initialWidth] = useLocalStorage(
    `ListLayout:${restorationKey.name}:initialWidth`,
    defaultWidth,
  );

  // If the location at this point in the hierarchy is "fully claimed"
  // then we assume that we should be showing the list. Essentially,
  // we are assuming that if you *had* selected something in the list
  // the resulted in showing a content view, then the location *at this point
  // in the hierarchy* would have more stuff after it to be "claimed" by the
  // content pane.
  const showListOnly = !location.unclaimedHref();

  useElementSize(ref, updateLayout);

  // Makes sure the list width is sane even if the container resizes. Also
  // handles initial sizing.
  function updateLayout() {
    const container = ref.current;
    if (!container) return;

    // We want to adjust all sizing properties using CSS variables without
    // re-rendering the component, for performance reasons.

    // Do we have a CSS var directly stored at "--list-width"?
    let listWidth = parseInt(
      container.style.getPropertyValue("--list-width") || "-1",
    );

    if (listWidth < 0) {
      // No CSS var, so we need to calculate it.
      listWidth = initialWidth;

      // Set the initial list width.
      container.style.setProperty("--list-width", listWidth + "px");
    }

    // The maximum list width is 50% the width of the container.
    const realMaxWidth = Math.floor(container.clientWidth / 2);

    // Ensure the list width is within bounds.
    listWidth = Math.max(
      minWidth,
      Math.min(Math.min(realMaxWidth, maxWidth), listWidth),
    );

    // Persist the list width.
    container.style.setProperty("--list-width", listWidth + "px");
  }

  function onDraggerPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault();

    const container = ref.current;
    if (!container) return;

    const listWidth = parseInt(
      container.style.getPropertyValue("--list-width") || "-1",
    );

    // The maximum list width is 50% the width of the container.
    const realMaxWidth = Math.floor(container.clientWidth / 2);

    const startX = e.clientX;
    const startWidth = listWidth;
    let hasDraggedMoreThan10px = false;

    const onPointerMove = (e: PointerEvent) => {
      const diff = e.clientX - startX;
      let newWidth = Math.max(
        minWidth,
        Math.min(Math.min(maxWidth, realMaxWidth), startWidth + diff),
      );

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
      updateLayout();
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      // Reset the data-dragging attribute.
      container.removeAttribute("data-dragging");

      // Store the new width.
      const newWidth = parseInt(
        container.style.getPropertyValue("--list-width") || "-1",
      );

      // Persist the new width.
      localStorage.setItem(
        `ListLayout:${restorationKey.name}:initialWidth`,
        newWidth.toString(),
      );
    };

    // Set the data-dragging attribute.
    container.setAttribute("data-dragging", "true");

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  return (
    <StyledListLayout ref={ref} data-show-list-only={!!showListOnly} {...rest}>
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
  @media (max-width: 95px) {
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

  &[data-dragging="true"] {
    /* Disable pointer events on our content children, in case one of them
       contains an iframe that's capturing the pointer events. */
    > *:nth-child(1),
    > *:nth-child(2) {
      pointer-events: none;
    }
  }
`;
