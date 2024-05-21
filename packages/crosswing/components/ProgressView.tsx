import { HTMLAttributes } from "react";
import { keyframes, styled } from "styled-components";
import { ColorBuilder, colors } from "../colors/colors.js";
import { easing } from "../shared/easing.js";
import { Donut, StyledDonut } from "./Donut.js";

export function ProgressView({
  size,
  progress,
  animated = true,
  thickness,
  foregroundColor = colors.primary,
  backgroundColor = colors.textBackgroundAlt,
  ...rest
}: {
  size?: string;
  /** Measured from 0..1 */
  progress?: number | null;
  animated?: boolean;
  thickness?: number;
  foregroundColor?: ColorBuilder | string;
  backgroundColor?: ColorBuilder | string;
} & HTMLAttributes<HTMLDivElement>) {
  function renderSections() {
    if (progress != null) {
      return [
        { amount: progress, color: foregroundColor },
        { amount: 1 - progress, color: "transparent" },
      ];
    } else {
      return [
        { amount: 1, color: foregroundColor },
        { amount: 10, color: "transparent" },
        { amount: 1, color: foregroundColor },
      ];
    }
  }

  return (
    <StyledProgressView
      data-is-indeterminate={progress == null}
      data-animated={!!animated}
      {...rest}
    >
      <Donut
        className="bg"
        size={size}
        thickness={thickness}
        sections={[
          {
            amount: 1,
            color: backgroundColor,
          },
        ]}
      />
      <Donut
        className="fg"
        size={size}
        thickness={thickness}
        sections={renderSections()}
      />
    </StyledProgressView>
  );
}

const spin = keyframes`
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

export const StyledProgressView = styled.div`
  /* The proper way to size ProgressView is the "size" property.
     If you try to size this component directly anyway, we'll just
     center the progress view inside. */
  position: relative;

  > ${StyledDonut} {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &[data-is-indeterminate="true"] {
    > ${StyledDonut}.fg {
      animation: ${spin} 1s ease-in-out infinite;
    }
  }

  &[data-is-indeterminate="false"][data-animated="true"] {
    > ${StyledDonut}.fg circle {
      transition:
        stroke-dasharray 0.5s ${easing.inOutCubic},
        stroke-dashoffset 0.5s ${easing.inOutCubic};
    }
  }
`;
