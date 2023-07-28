import { LinkButton } from "@cyber/components/LinkButton";
import { NoContent } from "@cyber/components/NoContent";
import { NavLayout } from "@cyber/router/navs/NavLayout.js";
import React from "react";
import { styled } from "styled-components";

export default function HomePage() {
  return (
    <NavLayout title="Home">
      <NoContent
        title="Home Page"
        children={
          <Content>
            <LinkButton to="items/1" children="Navigate to Item" />
            <LinkButton to="items/1?panel=two" children="Navigate to Panel 2" />
            <LinkButton
              to="/switch/two"
              children="Navigate to Panel 2 in Switch Tab"
            />
          </Content>
        }
      />
    </NavLayout>
  );
}

const Content = styled.div`
  display: flex;
  flex-flow: column;

  > * + * {
    margin-top: 10px;
  }
`;
