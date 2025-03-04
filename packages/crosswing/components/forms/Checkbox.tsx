import { HTMLAttributes, SyntheticEvent } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { CheckmarkIcon } from "../../icons/Checkmark.js";
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
        <CheckmarkIcon />
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
    border: 1px solid ${colors.mediumGray()};
    border-radius: 3px;
    position: relative;

    @media (prefers-color-scheme: dark) {
      border: 1px solid ${colors.darkerGray({ darken: 0.15 })};
    }

    > svg {
      position: absolute;
      top: -5px;
      left: 2px;
      transform: scale(1.1);
      pointer-events: none;
      color: ${colors.turquoise()};
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
