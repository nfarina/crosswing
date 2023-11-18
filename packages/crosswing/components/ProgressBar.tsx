import { CSSProperties, HTMLAttributes } from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors";

export type ProgressBarSize = "normal" | "larger" | "largest" | "smaller";

export function ProgressBar({
  value,
  size = "normal",
  rounded,
  animated = true,
  style,
  ...rest
}: {
  value: number;
  size?: ProgressBarSize;
  rounded?: boolean;
  animated?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const barHeight = (() => {
    switch (size) {
      case "largest":
        return "28px";
      case "larger":
        return "20px";
      case "smaller":
        return "8px";
      default:
        return "12px";
    }
  })();

  const cssProps = {
    ...style,
    "--bar-height": barHeight,
    "--value": `${Math.round(value * 100)}%`,
  } as CSSProperties;

  return (
    <StyledProgressBar
      style={cssProps}
      data-rounded={!!rounded}
      data-animated={!!animated}
      {...rest}
    >
      <div className="bar"></div>
    </StyledProgressBar>
  );
}

export const StyledProgressBar = styled.div`
  --rounded-corner: 9999px;

  position: relative;
  background-color: ${colors.lightGray({ alpha: 0.6 })};
  height: var(--bar-height);
  border-radius: var(--rounded-corner);
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background-color: ${colors.darkGray({ alpha: 0.2 })};
  }

  > .bar {
    position: absolute;
    left: 0;
    height: 100%;
    background: ${colors.turquoiseGradient()};
    width: var(--value);
    max-width: 100%;
  }

  &[data-rounded="true"] {
    > .bar {
      border-radius: var(--rounded-corner);
      min-width: var(--bar-height);
    }
  }

  &[data-animated="true"] {
    > .bar {
      transition: width 0.3s ease-in-out;
    }
  }
`;
