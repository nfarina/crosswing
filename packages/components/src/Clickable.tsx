import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { styled } from "styled-components";

/**
 * Defines a basic clickable element that supports being disabled, and
 * transitioning disabled state with animation. Note that the "type" attribute
 * is automatically set to "button" unless you give us another value. This
 * avoids unexpected behavior like accidental form submits.
 */
export function Clickable({
  children,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
}) {
  return <StyledClickable type={type} {...rest} children={children} />;
}

export const StyledClickable = styled.button`
  appearance: none;
  background-color: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  &:disabled {
    cursor: default;
    opacity: 0.5;
    pointer-events: none;
  }
`;
