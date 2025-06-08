import { HTMLAttributes, RefObject } from "react";
import { styled } from "styled-components";

/**
 * Constrains content to a centered width.
 */
export function CenteredLayout({
  ref,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  ref?: RefObject<HTMLDivElement | null>;
}) {
  return <StyledCenteredLayout ref={ref} {...rest} />;
}

export const StyledCenteredLayout = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  box-sizing: border-box;

  > * {
    flex-grow: 1;
    min-width: 0;
    width: 850px;
    max-width: 100%;
    box-sizing: border-box;
  }
`;
