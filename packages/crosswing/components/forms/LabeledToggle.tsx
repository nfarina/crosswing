import { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors";
import { fonts } from "../../fonts/fonts";
import { Toggle, ToggleSize } from "./Toggle";

export function LabeledToggle({
  label,
  detail,
  on,
  size,
  onClick,
  disabled,
  working,
  ...rest
}: HTMLAttributes<HTMLButtonElement> & {
  label: ReactNode;
  detail?: ReactNode;
  on?: boolean;
  size?: ToggleSize;
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
      <Toggle as="div" on={on} size={size} disabled={!!disabled || !!working} />
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
