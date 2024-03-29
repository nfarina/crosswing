import { ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { StyledToggle, Toggle } from "./Toggle.js";

/**
 * A control shaped like a button with a title and a toggle.
 */
export function ToggleButton({
  title,
  working,
  on,
  onClick,
  size: smaller,
  disabled,
  ...rest
}: Parameters<typeof Toggle>[0] & {
  title?: ReactNode;
  working?: boolean;
}) {
  return (
    <StyledToggleButton
      disabled={!!disabled || !!working}
      data-working={!!working}
      data-smaller={!!smaller}
      onClick={!working ? onClick : undefined}
      role="switch"
      aria-checked={!!on}
      {...rest}
    >
      <div className="content">
        {title && <div className="title" children={title} />}
      </div>
      <Toggle
        as="div"
        on={on}
        size={smaller}
        disabled={!!disabled || !!working}
      />
    </StyledToggleButton>
  );
}

export const StyledToggleButton = styled.button`
  /* Disable default <button> styles. */
  appearance: none;
  background-color: transparent;
  border: none;
  margin: 0;
  text-align: left;

  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 9999px;
  background: ${colors.lightGray()};

  @media (prefers-color-scheme: dark) {
    background: ${colors.extraExtraExtraDarkGray()};
  }

  > .content {
    flex-grow: 1;
    margin: 7px 13px 7px 9px;

    > .title {
      font: ${fonts.displayBold({ size: 15, line: "1" })};
      color: ${colors.text()};
    }
  }

  > ${StyledToggle} {
    flex-shrink: 0;
  }

  &[data-smaller="true"] {
    padding: 7px 9px;

    > .content {
      margin: 6px 10px 5px 5px;

      > .title {
        font: ${fonts.displayBold({ size: 14, line: "1" })};
      }
    }
  }

  &:disabled {
    cursor: default;

    > .content > .title {
      opacity: 0.5;
    }
  }
`;
