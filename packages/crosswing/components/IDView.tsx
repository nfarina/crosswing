import { MouseEvent } from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors.js";
import { fonts } from "../fonts/fonts.js";
import { CopyIcon } from "../icons/Copy.js";
import { useModalContext } from "../modals/context/ModalContext.js";
import { Clickable } from "./Clickable.js";

export function IDView({
  name,
  id,
  truncate = 6,
  onClick,
  ...rest
}: Parameters<typeof Clickable>[0] & {
  name: string;
  id: string;
  truncate?: number | false;
}) {
  const { showToast } = useModalContext();

  function onViewClick(e: MouseEvent<HTMLButtonElement>) {
    navigator.clipboard.writeText(id);
    showToast(`${name} ID copied to clipboard.`);
    onClick?.(e);
  }

  return (
    <StyledIDView onClick={onViewClick} {...rest}>
      <CopyIcon />
      <span className="text">{truncate ? id.slice(0, truncate) : id}</span>
    </StyledIDView>
  );
}

export const StyledIDView = styled(Clickable)`
  box-sizing: border-box;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: ${colors.textSecondary()};
  transition: color 0.2s ease-in-out;

  > svg {
    flex-shrink: 0;
    margin-right: 2px;
    width: 16px;
    height: 16px;
  }

  > .text {
    font: ${fonts.displayMono({ size: 13 })};
  }

  &:hover {
    color: ${colors.text()};
  }
`;
