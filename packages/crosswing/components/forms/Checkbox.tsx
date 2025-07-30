import { HTMLAttributes, SyntheticEvent } from "react";
import { styled } from "styled-components";
import { colors } from "../../colors/colors.js";
import { CheckIcon } from "../../icons/Check.js";
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
        <CheckIcon />
      </div>
    </StyledCheckbox>
  );
}

export const StyledCheckbox = styled(Clickable)`
  width: 36px;
  height: 36px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  display: flex; /* Gets rid of extra space below the button. */

  > .box {
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 1.5px solid ${colors.gray600()};
    border-radius: 3px;
    position: relative;

    @media (prefers-color-scheme: dark) {
      border-color: ${colors.gray300()};
    }

    > svg {
      position: absolute;
      top: -3px;
      left: -2.5px;
      transform: scale(0.85);
      pointer-events: none;
      color: ${colors.white()};
    }
  }

  &[data-checked="true"] {
    > .box {
      border: none;
      background: ${colors.primary()};
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
