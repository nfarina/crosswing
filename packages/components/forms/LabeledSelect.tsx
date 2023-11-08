import { colors } from "@cyber/theme/colors";
import { fonts } from "@cyber/theme/fonts";
import { ReactNode, SelectHTMLAttributes } from "react";
import { styled } from "styled-components";
import { Select } from "./Select";

export function LabeledSelect({
  label,
  detail,
  style,
  className,
  disabled,
  working,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: ReactNode;
  detail?: ReactNode;
  disabled?: boolean;
  working?: boolean;
  value?: string;
  onValueChange?: (newValue: any) => void;
}) {
  return (
    <StyledLabeledSelect
      style={style}
      className={className}
      data-has-label={!!label}
      data-disabled={!!disabled}
    >
      <div className="content">
        <div className="label" children={label} />
        <div className="detail" children={detail} />
      </div>
      <Select disabled={!!disabled || !!working} {...rest} />
    </StyledLabeledSelect>
  );
}

export const StyledLabeledSelect = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  min-height: 50px;
  padding: 0 10px;
  box-sizing: border-box;

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
      font: ${fonts.displayBold({ size: 14, line: "18px" })};
      color: ${colors.text()};
    }

    > .detail {
      font: ${fonts.display({ size: 14, line: "18px" })};
      color: ${colors.textSecondary()};
    }
  }

  &[data-disabled="true"] {
    cursor: default;
    pointer-events: none;

    > .content > .label {
      opacity: 0.5;
    }
  }
`;
