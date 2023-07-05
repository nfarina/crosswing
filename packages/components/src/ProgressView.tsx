import { ColorBuilder, colors, easing } from "@cyber/theme";
import React, { HTMLAttributes } from "react";
import { keyframes, styled } from "styled-components";
import { Donut } from "./Donut.js";

export function ProgressView({
  size,
  progress,
  animated = true,
  thickness,
  foregroundColor = colors.orange,
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
  if (progress === undefined || progress === null) {
    return (
      <StyledProgressView {...rest}>
        <IndeterminateDonut
          size={size}
          thickness={thickness}
          sections={[
            { amount: 1, color: foregroundColor },
            { amount: 10, color: backgroundColor },
            { amount: 1, color: foregroundColor },
          ]}
        />
      </StyledProgressView>
    );
  }

  return (
    <StyledProgressView {...rest}>
      <AnimatedDonut
        size={size}
        thickness={thickness}
        data-animate={!!animated}
        sections={[
          { amount: progress, color: foregroundColor },
          { amount: 1 - progress, color: backgroundColor },
        ]}
      />
    </StyledProgressView>
  );
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const StyledProgressView = styled.div`
  /* The proper way to size ProgressView is the "size" property.
     If you try to size this component directly anyway, we'll just
     center the progress view inside. */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndeterminateDonut = styled(Donut)`
  animation: ${spin} 1s ease-in-out infinite;
`;

const AnimatedDonut = styled(Donut)`
  &[data-animate="true"] > circle {
    transition:
      stroke-dasharray 0.5s ${easing.inOutCubic},
      stroke-dashoffset 0.5s ${easing.inOutCubic};
  }
`;
