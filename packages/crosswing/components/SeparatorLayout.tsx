import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors.js";

export type SeparatorEdges = "none" | "top" | "bottom" | "both";

export const SeparatorLayout = forwardRef(
  (
    {
      edges = "both",
      inset = ["10px", "0"],
      children,
      style,
      ...rest
    }: {
      edges?: SeparatorEdges;
      inset?: string | [left: string, right: string];
      children?: ReactNode;
    } & HTMLAttributes<HTMLDivElement>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const cssProps = {
      ...style,
      "--inset-left": typeof inset === "string" ? inset : inset[0],
      "--inset-right": typeof inset === "string" ? inset : inset[1],
    } as CSSProperties;

    return (
      <StyledSeparatorLayout
        data-edges={edges}
        children={children}
        style={cssProps}
        ref={ref}
        {...rest}
      />
    );
  },
);

export const StyledSeparatorLayout = styled.div`
  display: flex;
  flex-flow: column;
  isolation: isolate;

  > * {
    position: relative;
    flex-shrink: 0;
  }

  > *::before {
    z-index: 99;
    content: "";
    position: absolute;
    left: var(--inset-left);
    right: var(--inset-right);
    top: 0px;
    height: 1px;
    background: ${colors.separator()};
  }

  > *::after {
    z-index: 99;
    content: "";
    position: absolute;
    left: var(--inset-left);
    right: var(--inset-right);
    bottom: 0px;
    height: 1px;
    background: ${colors.separator()};
  }

  > * + * {
    margin-top: -1px;
  }

  > * + *::before {
    display: none;
  }

  &[data-edges="bottom"] > *:first-child::before {
    display: none;
  }

  &[data-edges="none"] > *:first-child::before {
    display: none;
  }

  &[data-edges="top"] > *:last-child::after {
    display: none;
  }

  &[data-edges="none"] > *:last-child::after {
    display: none;
  }
`;

/** For Storybook. */
export function SeparatorDecorator(Story: () => any) {
  return <SeparatorLayout children={<Story />} />;
}
