import { colors } from "@cyber/theme/colors";
import Checkmark from "@cyber/theme/icons/Checkmark.svg";
import React, { HTMLAttributes, SyntheticEvent } from "react";
import { styled } from "styled-components";
import { Clickable } from "../Clickable.js";

export function Checkbox({
  checked,
  onClick,
  disabled,
  as,
  ...rest
}: {
  checked?: boolean;
  onClick?: (e: SyntheticEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  as?: string | React.ComponentType<any>;
} & Omit<HTMLAttributes<HTMLButtonElement>, "onClick">) {
  return (
    <StyledCheckbox
      data-checked={!!checked}
      disabled={!!disabled}
      data-disabled={!!disabled}
      onClick={onClick}
      role="checkbox"
      aria-checked={!!checked}
      as={as}
      {...rest}
    >
      <div className="box">
        <Checkmark />
      </div>
    </StyledCheckbox>
  );
}

export const StyledCheckbox = styled(Clickable)`
  width: 40px;
  height: 40px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  display: flex; /* Gets rid of extra space below the button. */

  > .box {
    width: 20px;
    height: 20px;
    border: 1px solid ${colors.controlBorder()};
    border-radius: 3px;
    position: relative;

    > svg {
      position: absolute;
      top: -4px;
      left: 1px;
      transform: scale(1.8);
      pointer-events: none;
    }
  }

  &[data-checked="false"] {
    > .box {
      > svg {
        display: none;
      }
    }
  }
`;
