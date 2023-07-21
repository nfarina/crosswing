import React, { useState } from "react";
import { styled } from "styled-components";
import { AspectLayout, StyledAspectLayout } from "./AspectLayout.js";

export default {
  title: "components/AspectLayout",
  component: AspectLayout,
  parameters: { layout: "centered" },
};

export const Default = () => {
  const [large, setLarge] = useState(false);

  return (
    <Container data-large={large}>
      <AspectLayout aspect={1.586}>
        <div className="card" />
      </AspectLayout>
      <button children="Resize" onClick={() => setLarge((l) => !l)} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin: 10px;

  > ${StyledAspectLayout} {
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    border: 1px dashed lightgray;

    > .card {
      background: #bb26c9;
      border-radius: 6px;
    }
  }

  &[data-large="true"] {
    > ${StyledAspectLayout} {
      width: 200px;
      height: 200px;
    }
  }

  > button {
    margin-top: 10px;
  }
`;
