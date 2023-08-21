import React, { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { useHost } from "../host/context/HostContext";
import { colors } from "../theme/colors/colors";

export interface Props {
  href: string;
  children?: ReactNode;
}

// A special kind of component that renders a tag that appears like
// an <a> tag, but is just a <span> (this allows for the component to
// appear inside a parent <a> tag like <Link>).
export function ExternalLink({
  href,
  children,
  ...rest
}: { href?: string } & HTMLAttributes<HTMLSpanElement>) {
  const { openUrl } = useHost();

  function onClick(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (href) openUrl(href);
  }

  return (
    <StyledExternalLink
      data-is-link // For <StatusBadge>
      onClick={onClick}
      children={children ?? href}
      {...rest}
    />
  );
}

export const StyledExternalLink = styled.span`
  color: ${colors.primary()};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
