import { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { styled } from "styled-components";
import { colors } from "../colors/colors";
import { useHost } from "../host/context/HostContext";

export interface Props {
  href: string;
  children?: ReactNode;
}

/**
 * A special kind of component that renders a link that could potentially open
 * outside the "app" (when rendered in a native host). Default to rendering as
 * a <a> for desktop, but can be rendered as a <span> if you want to embed it
 * inside a parent <a> tag like <Link>.
 */
export function ExternalLink({
  as = "a",
  href,
  children,
  ...rest
}: { as?: "a" | "span"; href?: string } & HTMLAttributes<HTMLSpanElement>) {
  const { openUrl } = useHost();

  function onClick(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (href) openUrl(href);
  }

  return (
    <StyledExternalLink
      as={as}
      {...(as === "a" ? { href } : null)}
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
