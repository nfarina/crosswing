import Debug from "debug";
import { HTMLAttributes, ReactNode, useRef } from "react";
import { styled } from "styled-components";
import { useElementSize } from "../hooks/useElementSize";

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

  useElementSize(
    ref,
    ({ width, height }) => {
      const { current: element } = ref;
      if (!element) return;

      if (width > 0 || height > 0) {
        // We have a size! So we can adjust our element's width or height, depending
        // on what's desired.
        if (adjust === "width" && height > 0) {
          debug(`Adjusting width for height ${height}`);

          element.style.width = aspect * height + "px";
        } else if (adjust === "height" && width > 0) {
          debug(`Adjusting height for width ${width}`);

          element.style.height = width / aspect + "px";
        }
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
