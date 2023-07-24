import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import React, { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { Toggle } from "./Toggle.js";

export function LabeledToggle({
  label,
  detail,
  on,
  smaller,
  onClick,
  disabled,
  working,
  ...rest
}: HTMLAttributes<HTMLButtonElement> & {
  label: ReactNode;
  detail?: ReactNode;
  on?: boolean;
  smaller?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  working?: boolean;
}) {
  return (
    <StyledLabeledToggle
      disabled={!!disabled || !!working}
      onClick={!working ? onClick : undefined}
      role="switch"
      type="button"
      aria-checked={!!on}
      {...rest}
    >
      <div className="content">
        <div className="label" children={label} />
        <div className="detail" children={detail} />
      </div>
      <Toggle
        as="div"
        on={on}
        smaller={smaller}
        disabled={!!disabled || !!working}
      />
    </StyledLabeledToggle>
  );
}

export const StyledLabeledToggle = styled.button`
  /* Disable default <button> styles. */
  appearance: none;
  background-color: transparent;
  border: none;
  text-align: left;

  display: flex;
  flex-flow: row;
  align-items: center;
  min-height: 50px;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;

  > * {
    flex-shrink: 0;
  }

  > .content {
    width: 0;
    display: flex;
    flex-flow: column;
    flex-grow: 1;
    margin: 7px 20px 7px 0;

    > .label {
      font: ${fonts.displayBold({ size: 14, line: "20px" })};
      color: ${colors.text()};
      transition: opacity 0.2s ease-in-out;
      word-break: break-word;
    }

    > .detail {
      font: ${fonts.display({ size: 14, line: "20px" })};
      color: ${colors.textSecondary()};
      transition: opacity 0.2s ease-in-out;
      word-break: break-word;
    }
  }

  &:disabled {
    cursor: default;

    > .content > .label {
      opacity: 0.5;
    }
  }
`;
