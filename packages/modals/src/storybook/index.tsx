import { colors } from "@cyber/theme/colors";
import React from "react";
import { styled } from "styled-components";
import { ModalRootProvider } from "../context/ModalRootProvider.js";

/**
 * For Storybook; renders your story inside a <ModalRootProvider>.
 */
export function ModalDecorator(Story: () => any) {
  return <ModalRootProvider children={<Story />} />;
}

export const ButtonContainer = styled.div`
  background: ${colors.textBackground()};
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  > * + * {
    margin-top: 10px;
  }
`;
