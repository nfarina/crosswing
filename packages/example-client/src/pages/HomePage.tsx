import { NoContent } from "@cyber/components/NoContent";
import { Link } from "@cyber/router/link";
import { NavLayout } from "@cyber/router/navs/NavLayout.js";
import React, { useState } from "react";
import { styled } from "styled-components";

export default function HomePage() {
  const [clicks, setClicks] = useState(0);

  return (
    <NavLayout title="Home">
      <NoContent
        title="Home Page"
        subtitle={
          <Content>
            <div onClick={() => setClicks((clicks) => clicks + 1)}>
              Clicked {clicks} times.
            </div>
            <Link to="items/1" children="Navigate to Item" />
            <Link to="items/1?panel=two" children="Navigate to Panel 2" />
            <Link
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
