import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import React, { HTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";
import { ProgressView } from "./ProgressView.js";
import { Spinner } from "./Spinner.js";

export function LoadingCurtain({
  hidden,
  type = "spinner",
  transparent,
  progress,
  message,
  smaller = false,
  ...rest
}: {
  hidden?: boolean;
  type?: "spinner" | "progress";
  transparent?: boolean;
  progress?: number | null;
  message?: ReactNode;
  smaller?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  if (hidden) {
    return null; // don't render anything!
  }

  return (
    <StyledLoadingCurtain data-transparent={!!transparent} {...rest}>
      {type === "progress" ? (
        <ProgressView size="75px" thickness={0.05} progress={progress} />
      ) : (
        <Spinner smaller={smaller} />
      )}
      {message && <div className="message">{message}</div>}
    </StyledLoadingCurtain>
  );
}

export const StyledLoadingCurtain = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  background: ${colors.textBackground()};

  &[data-transparent="true"] {
    background: transparent;
  }

  > .message {
    font: ${fonts.display({ size: 15, line: "1.3" })};
    color: ${colors.text()};
    margin: 15px;
    margin-top: 30px;
    text-align: center;
  }
`;
