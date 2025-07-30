import { ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { fonts } from "../../fonts/fonts.js";
import { Dropdown, StyledDropdown } from "./Dropdown.js";

export function LabeledDropdown({
  label,
  detail,
  style,
  className,
  disabled,
  working,
  newStyle,
  ...rest
}: Parameters<typeof Dropdown>[0] & {
  label: ReactNode;
  detail?: ReactNode;
  newStyle?: boolean;
}) {
  return (
    <StyledLabeledDropdown
      style={style}
      className={className}
      data-has-label={!!label}
      data-disabled={!!disabled}
      data-new-style={!!newStyle}
    >
      <div className="content">
        <div className="label" children={label} />
        <div className="detail" children={detail} />
      </div>
      <Dropdown disabled={!!disabled || !!working} {...rest} />
    </StyledLabeledDropdown>
  );
}

export const StyledLabeledDropdown = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  min-height: 50px;
  padding: 0 10px;
  box-sizing: border-box;

  > .content {
    width: 0;
    flex-grow: 1;
    display: flex;
    flex-flow: column;
    margin: 7px 20px 7px 0;

    > .label {
      font: ${fonts.displayBold({ size: 14, line: "18px" })};
      color: ${colors.text()};
    }

    > .detail {
      font: ${fonts.display({ size: 14, line: "18px" })};
      color: ${colors.textSecondary()};
    }
  }

  > ${StyledDropdown} {
    flex-shrink: 0;
    box-sizing: border-box;
    max-width: 50%;
  }

  &[data-disabled="true"] {
    cursor: default;
    pointer-events: none;

    > .content > .label {
      opacity: 0.5;
    }
  }

  &[data-new-style="true"] {
    padding-left: 0;

    > .content > .label {
      font: ${fonts.display({ size: 14, line: "20px" })};
    }

    > .content > .detail {
      font: ${fonts.display({ size: 12, line: "16px" })};
    }
  }
`;
