import { HTMLAttributes, MouseEvent, use } from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors.js";
import { fonts } from "../fonts/fonts.js";
import { CopyIcon } from "../icons/Copy.js";
import { ModalContext } from "../modals/context/ModalContext.js";

export function IDView({
  name,
  id,
  truncate = 6,
  onClick,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  name: string;
  id: string;
  truncate?: number | false;
}) {
  const { showToast } = use(ModalContext);

  function onViewClick(e: MouseEvent<HTMLDivElement>) {
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

export const StyledIDView = styled.div`
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
    transform: translateY(-1px);
  }

  &:hover {
    color: ${colors.text()};
  }
`;
