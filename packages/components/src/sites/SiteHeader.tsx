import React, { ReactNode } from "react";
import { styled } from "styled-components";
import { PageTitle, StyledPageTitle } from "./PageTitle.js";

export function SiteHeader({
  siteTitle,
  tasksButton,
  searchButton,
  rightButton,
}: {
  siteTitle: string;
  tasksButton?: ReactNode | null;
  searchButton?: ReactNode | null;
  rightButton?: ReactNode;
}) {
  return (
    <StyledSiteHeader>
      <PageTitle siteTitle={siteTitle} />
      {tasksButton && <div className="tasks">{tasksButton}</div>}
      {searchButton && <div className="search">{searchButton}</div>}
      {rightButton && <div className="right">{rightButton}</div>}
    </StyledSiteHeader>
  );
}

export const StyledSiteHeader = styled.div`
  display: flex;
  flex-flow: row;

  > * {
    flex-shrink: 0;
  }

  > ${StyledPageTitle} {
    flex-shrink: 0;
    flex-grow: 1;
  }

  > .tasks {
    display: flex;
    flex-flow: row;

    > * {
      flex-grow: 1;
    }
  }

  > .search {
    width: 40px;
    display: flex;
    flex-flow: row;

    > * {
      flex-grow: 1;
    }
  }

  > .right {
    width: 80px;
    display: flex;
    flex-flow: row;

    > * {
      flex-grow: 1;
    }
  }

  > .search + .right {
    width: 40px;
  }
`;
