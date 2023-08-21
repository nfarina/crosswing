import React from "react";
import { styled } from "styled-components";
import { NavLayout } from "../../../../router/navs/NavLayout";
import { LinkButton } from "../../../LinkButton";
import { NoContent } from "../../../NoContent";

export default function PageOne() {
  return (
    <NavLayout title="Page One">
      <NoContent
        title="Page One"
        children={
          <Content>
            <LinkButton to="pages/two" children="Page Two" />
            <LinkButton
              to="pages/two?panel=two"
              children="Page Two -> Panel Two"
            />
            <LinkButton to="/switch/two" children="Switch Tab -> Panel Two" />
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
    margin-top: 20px;
  }
`;
