import Debug from "debug";
import { HTMLAttributes, ReactNode, useRef } from "react";
import { styled } from "styled-components";
import { useElementSize } from "../hooks/useElementSize.js";

const debug = Debug("components:AspectLayout");

export function AspectLayout({
  aspect,
  adjust = "height",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  aspect: number;
  adjust?: "width" | "height";
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Keep track of the last time we resized, and when that happened, so we can
  // prevent flip-flop behavior (like when our resizing causes scrollbars to
  // appear, which causes us to resize again, and the scrollbars disappear, and
  // we keep resizing back and forth). We store only the total area.
  const lastSizes = useRef<{ area: number; timestamp: number }[]>([]);

  useElementSize(
    ref,
    ({ width, height }) => {
      const { current: element } = ref;
      if (!element) return;

      // Clean up old entries in the lastSizes array.
      lastSizes.current = lastSizes.current.filter(
        (entry) => Date.now() - entry.timestamp < 500,
      );

      let newWidth = width;
      let newHeight = height;

      if (width > 0 || height > 0) {
        // Adjust the element's width or height depending on the specified aspect ratio
        if (adjust === "width" && height > 0) {
          debug(`Adjusting width for height ${height}`);
          newWidth = height * aspect;
        } else if (adjust === "height" && width > 0) {
          debug(`Adjusting height for width ${width}`);
          newHeight = width / aspect;
        }
      }

      // What's the current area?
      const area = newWidth * newHeight;

      // Record the new area.
      lastSizes.current.push({ area, timestamp: Date.now() });

      // We consider the area to have flip-flopped if we have entries both
      // larger and smaller than the current area.
      const isFlopping =
        lastSizes.current.some((entry) => entry.area > area) &&
        lastSizes.current.some((entry) => entry.area < area);

      if (isFlopping) {
        debug("Flopping detected, skipping resize");
        return;
      }

      if (adjust === "width") {
        element.style.width = newWidth + "px";
      } else if (adjust === "height") {
        element.style.height = newHeight + "px";
      }
    },
    [aspect],
  );

  return <StyledAspectLayout ref={ref} children={children} {...rest} />;
}

export const StyledAspectLayout = styled.div`
  display: flex;
  flex-flow: column;

  > * {
    flex-grow: 1;
  }
`;
