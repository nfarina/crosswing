import { HTMLAttributes } from "react";
import { keyframes, styled } from "styled-components";
import { ColorBuilder, colors } from "../colors/colors";
import { easing } from "../shared/easing";
import { Donut, StyledDonut } from "./Donut";

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
        { amount: 1 - progress, color: backgroundColor },
      ];
    } else {
      return [
        { amount: 1, color: foregroundColor },
        { amount: 10, color: backgroundColor },
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
      <Donut size={size} thickness={thickness} sections={renderSections()} />
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

  &[data-is-indeterminate="true"] {
    > ${StyledDonut} {
      animation: ${spin} 1s ease-in-out infinite;
    }
  }

  &[data-is-indeterminate="false"][data-animated="true"] {
    > ${StyledDonut} > circle {
      transition:
        stroke-dasharray 0.5s ${easing.inOutCubic},
        stroke-dashoffset 0.5s ${easing.inOutCubic};
    }
  }
`;
