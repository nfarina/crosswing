import {
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { colors } from "../../colors/colors";
import { useElementSize } from "../../hooks/useElementSize.js";
import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import { ToolbarSidebarButton } from "../toolbar/Toolbar.js";
import { useToolbar } from "../toolbar/ToolbarContext.js";

export const SidebarToggleInsertionPoint = "SidebarToggle";

// The maximum sidebar width is the width of the container minus a bit
// (so you can still drag it smaller in case it buts up against a ListLayout
// which is also draggable!).
const GUTTER_WIDTH = 25;

export function SidebarLayout({
  sidebarDefaultWidth = 275,
  sidebarMinWidth = 275,
  contentMinWidth = 375,
  sidebarVisible = false,
  onSidebarVisibleChange,
  restorationKey,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  /** The "natural" (and default) width of the sidebar. */
  sidebarDefaultWidth?: number;
  /** The minimum width of the sidebar. */
  sidebarMinWidth?: number;
  /** The minimum width of the content area. */
  contentMinWidth?: number;
  /** Whether the sidebar is currently visible. */
  sidebarVisible?: boolean;
  /** Called when the sidebar visibility changes by clicking outside (in overlay mode) or by toggling the toolbar button. */
  onSidebarVisibleChange?: (visible: boolean) => void;
  /**
   * Allows the parent component to store the sidebar width in a persistent way.
   * This could be a string but then it's easy to forget to change the string
   * when copy/pasting code, so it's a function instead, typically your
   * component function, which we'll access the `name` property of.
   */
  restorationKey: Function;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { getInsertionRef } = useToolbar();

  // Persist the sidebar width across window reloads.
  const [initialSidebarWidth] = useLocalStorage(
    `SidebarLayout:${restorationKey.name}:initialSidebarWidth`,
    sidebarDefaultWidth,
  );

  useElementSize(ref, updateLayout);

  function updateLayout() {
    const container = ref.current;
    if (!container) return;

    // We want to adjust all sizing properties using CSS variables without
    // re-rendering the component, for performance reasons.

    // Do we have a CSS var directly stored at "--sidebar-width"?
    let sidebarWidth = parseInt(
      container.style.getPropertyValue("--sidebar-width") || "-1",
    );

    if (sidebarWidth < 0) {
      // No CSS var, so we need to calculate it.
      sidebarWidth = initialSidebarWidth;

      // Set the initial sidebar width.
      container.style.setProperty("--sidebar-width", sidebarWidth + "px");
    }

    // Enforce the maximum sidebar width.
    const sidebarMaxWidth = Math.max(container.clientWidth - GUTTER_WIDTH, 0);

    if (sidebarWidth > sidebarMaxWidth) {
      sidebarWidth = sidebarMaxWidth;
      container.style.setProperty("--sidebar-width", sidebarWidth + "px");
    }

    // How much room do we have left for the content?
    const contentWidth = container.clientWidth - sidebarWidth;

    // If the content width is less than the minimum, we need to use overlay
    // mode and make the sidebar cover the content.
    container.setAttribute(
      "data-layout",
      contentWidth < contentMinWidth ? "overlay" : "shrink",
    );

    // Now that we've set the layout, we can enable transitions.
    container.setAttribute("data-transitions-enabled", "true");
  }

  const toggleButton = (
    <ToolbarSidebarButton
      onClick={() => onSidebarVisibleChange?.(!sidebarVisible)}
      active={sidebarVisible}
    />
  );

  const insertionEl = getInsertionRef(SidebarToggleInsertionPoint).current;

  //
  // Dragging.
  //

  function onDraggerPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault();

    const container = ref.current;
    if (!container) return;

    const sidebarWidth = parseInt(
      container.style.getPropertyValue("--sidebar-width") || "-1",
    );

    // The maximum sidebar width is the width of the container minus the gutter.
    const sidebarMaxWidth = Math.max(container.clientWidth - GUTTER_WIDTH, 0);

    const startX = e.clientX;
    const startWidth = sidebarWidth;
    let hasDraggedMoreThan10px = false;

    const onPointerMove = (e: PointerEvent) => {
      const diff = startX - e.clientX;
      let newWidth = Math.max(
        sidebarMinWidth,
        Math.min(sidebarMaxWidth, startWidth + diff),
      );

      if (Math.abs(diff) > 10) {
        hasDraggedMoreThan10px = true;
      }

      // We want to "snap" to either the default width, min width, or max width,
      // if we are within 10 pixels of them. But not before we've dragged more
      // than 10 pixels, because otherwise it feels weird.
      if (hasDraggedMoreThan10px) {
        const snapWidths = [
          sidebarDefaultWidth,
          sidebarMinWidth,
          sidebarMaxWidth,
        ];

        const closestSnapWidth = snapWidths.reduce((prev, curr) =>
          Math.abs(curr - newWidth) < Math.abs(prev - newWidth) ? curr : prev,
        );

        if (Math.abs(newWidth - closestSnapWidth) < 10) {
          newWidth = closestSnapWidth;
        }
      }

      container.style.setProperty("--sidebar-width", newWidth + "px");
      updateLayout();
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      // Reset the data-dragging attribute.
      container.removeAttribute("data-dragging");

      // Store the new width.
      const newWidth = parseInt(
        container.style.getPropertyValue("--sidebar-width") || "-1",
      );

      // Persist the new width.
      localStorage.setItem(
        `SidebarLayout:${restorationKey.name}:initialSidebarWidth`,
        newWidth.toString(),
      );
    };

    // Set the data-dragging attribute to prevent animation.
    container.setAttribute("data-dragging", "true");

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  return (
    <StyledSidebarLayout
      ref={ref}
      data-sidebar-visible={sidebarVisible}
      {...rest}
    >
      {insertionEl && createPortal(toggleButton, insertionEl)}
      {children}
      <div
        className="overlay"
        onClick={() => onSidebarVisibleChange?.(false)}
      />
      <div className="dragger" onPointerDown={onDraggerPointerDown}>
        <div className="drag-handle" />
      </div>
    </StyledSidebarLayout>
  );
}

export const StyledSidebarLayout = styled.div`
  display: flex;
  flex-flow: column;
  overflow: hidden;
  position: relative;

  /* Content. */
  > *:nth-child(1) {
    height: 0;
    flex-grow: 1;
    margin-right: var(--sidebar-width);
    z-index: 0;
    /** Help you out with common starting bugs. */
    box-sizing: border-box;
  }

  /* Sidebar. */
  > *:nth-child(2) {
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    right: 0;
    width: var(--sidebar-width);
    max-width: 100%;
    background: ${colors.textBackground()};
    flex-shrink: 0;
    border-left: 1px solid ${colors.separator()};
    /** Help you out with common starting bugs. */
    box-sizing: border-box;
  }

  /* Overlay. Only used when sidebar is covering up content. */
  > .overlay {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${colors.black({ alpha: 0.5 })};
    opacity: 0;
    pointer-events: none;
  }

  /* Dragger. */
  > .dragger {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    right: calc(var(--sidebar-width) - 5px);
    width: 10px;
    cursor: ew-resize;

    > .drag-handle {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 4px;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      background: ${colors.lightBlue()};

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

  &[data-sidebar-visible="false"] {
    /* Content. */
    > *:nth-child(1) {
      margin-right: 0;
    }

    /* Sidebar. */
    > *:nth-child(2) {
      transform: translateX(
        calc(var(--sidebar-width) + 25px)
      ); /* Account for sidebar shadow. */
    }

    /* Dragger. */
    > .dragger {
      display: none;
    }
  }

  &[data-layout="overlay"] {
    /* Content. */
    > *:nth-child(1) {
      margin-right: 0;
    }

    /* Sidebar. */
    > *:nth-child(2) {
      box-shadow: -4px 0 12px ${colors.black({ alpha: 0.5 })};

      @media (prefers-color-scheme: dark) {
        box-shadow: -4px 0 12px ${colors.black()};
      }
    }

    /* Use the overlay. */
    &[data-sidebar-visible="true"] {
      > .overlay {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  &[data-transitions-enabled="true"] {
    /* Content. */
    > *:nth-child(1) {
      transition: margin-right 0.2s ease-in-out;
    }

    /* Sidebar. */
    > *:nth-child(2) {
      transition: transform 0.2s ease-in-out;
    }

    /* Overlay. */
    > .overlay {
      transition: opacity 0.2s ease-in-out;
    }
  }

  &[data-dragging="true"] {
    /* Disable scrolling while dragging. */
    touch-action: none;

    /* Disable transitions. */
    > * {
      transition: none !important;
    }

    /* Disable pointer events on our content children, in case one of them
       contains an iframe that's capturing the pointer events. */
    > *:nth-child(1),
    > *:nth-child(2) {
      pointer-events: none;
    }
  }
`;
