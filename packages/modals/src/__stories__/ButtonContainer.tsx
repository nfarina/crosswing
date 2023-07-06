import { colors } from "@cyber/theme/colors";
import { styled } from "styled-components";

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
